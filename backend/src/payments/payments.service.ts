import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from "stripe";
import { Form } from "../forms/form.entity";
import { PdfService } from "../pdf/pdf.service";
import { AiService } from "../ai/ai.service";
import { EmailService } from "../email/email.service";

const PRICES: Record<string, number> = {
  succession: 1900,
  naturalisation: 2900,
  maprimereno: 2400,
};

const LABELS: Record<string, string> = {
  succession: "Déclaration de succession",
  naturalisation: "Demande de naturalisation",
  maprimereno: "MaPrimeRénov'",
};

@Injectable()
export class PaymentsService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    private config: ConfigService,
    @InjectRepository(Form) private formRepo: Repository<Form>,
    private pdfService: PdfService,
    private aiService: AiService,
    private emailService: EmailService,
  ) {
    this.stripe = new Stripe(this.config.get<string>("STRIPE_SECRET_KEY")!);
  }

  async createCheckoutSession(formId: string, type: string, userId: string) {
    const frontend = this.config.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const form = await this.formRepo.findOne({ where: { id: formId, userId } });
    if (!form) throw new BadRequestException("Formulaire introuvable");

    const amount = PRICES[type] ?? 1900;

    console.log("Stripe checkout - type:", type, "amount:", amount, "formId:", formId);

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: "Formulaire administratif",
            },
          },
        },
      ],
      success_url: `${frontend}/form/${type}/success?session_id={CHECKOUT_SESSION_ID}&formId=${formId}`,
      cancel_url: `${frontend}/form/${type}/payment?formId=${formId}&cancelled=true`,
    });

    return { url: session.url };
  }

  async confirmPayment(sessionId: string, formId: string, userId: string) {
    console.log("confirm - sessionId:", sessionId, "formId:", formId, "userId:", userId);
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    console.log("confirm - payment_status:", session.payment_status);
    if (session.payment_status !== "paid") {
      throw new BadRequestException("Paiement non complété");
    }

    const form = await this.formRepo.findOne({ where: { id: formId, userId } });
    console.log("confirm - form found:", form ? form.id : "NOT FOUND");
    if (!form) throw new BadRequestException("Formulaire introuvable");

    // Idempotent — already processed
    if (form.status === "generated") {
      return {
        status: "generated",
        pdfBase64: form.data.__pdf as string,
        letter: form.data.__letter as string,
      };
    }

    form.status = "paid";
    await this.formRepo.save(form);

    // Generate PDF and AI letter in parallel
    const [pdfBytes, letter] = await Promise.all([
      this.pdfService.generate(form),
      this.aiService.generateLetter(form.type, form.data),
    ]);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    form.status = "generated";
    form.data = { ...form.data, __pdf: pdfBase64, __letter: letter };
    await this.formRepo.save(form);

    // Send confirmation email (non-blocking — don't fail if email fails)
    const d = form.data as Record<string, string>;
    this.emailService
      .sendFormConfirmation({
        to: d.email ?? "",
        name: `${d.prenom ?? ""} ${d.nom ?? ""}`.trim(),
        formType: form.type,
        pdfBase64,
        letter,
        formId: form.id,
      })
      .catch(() => null);

    return { status: "generated", pdfBase64, letter };
  }
}
