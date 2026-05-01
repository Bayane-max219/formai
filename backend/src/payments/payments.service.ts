import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from "stripe";
import { Form } from "../forms/form.entity";
import { PdfService } from "../pdf/pdf.service";

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
  ) {
    this.stripe = new Stripe(this.config.get<string>("STRIPE_SECRET_KEY")!);
  }

  async createCheckoutSession(formId: string, type: string, userId: string) {
    const frontend = this.config.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const form = await this.formRepo.findOne({ where: { id: formId, userId } });
    if (!form) throw new BadRequestException("Formulaire introuvable");

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: LABELS[type] ?? type },
            unit_amount: PRICES[type] ?? 1900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontend}/form/${type}/success?session_id={CHECKOUT_SESSION_ID}&formId=${formId}`,
      cancel_url: `${frontend}/form/${type}/payment?formId=${formId}&cancelled=true`,
      metadata: { formId, userId },
    });

    return { url: session.url };
  }

  async confirmPayment(sessionId: string, formId: string, userId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw new BadRequestException("Paiement non complété");
    }

    const form = await this.formRepo.findOne({ where: { id: formId, userId } });
    if (!form) throw new BadRequestException("Formulaire introuvable");

    // Idempotent — already processed
    if (form.status === "generated") {
      return { status: "generated", pdfBase64: form.data.__pdf as string };
    }

    form.status = "paid";
    await this.formRepo.save(form);

    const pdfBytes = await this.pdfService.generate(form);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    form.status = "generated";
    form.data = { ...form.data, __pdf: pdfBase64 };
    await this.formRepo.save(form);

    return { status: "generated", pdfBase64 };
  }
}
