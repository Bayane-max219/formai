import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import sgMail from "@sendgrid/mail";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private enabled = false;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>("SENDGRID_API_KEY");
    if (apiKey && !apiKey.includes("REPLACE")) {
      sgMail.setApiKey(apiKey);
      this.enabled = true;
    } else {
      this.logger.warn("SendGrid API key not set — emails disabled");
    }
  }

  async sendFormConfirmation(opts: {
    to: string;
    name: string;
    formType: string;
    pdfBase64: string;
    letter: string;
    formId: string;
  }): Promise<void> {
    if (!this.enabled) {
      this.logger.log(`[MOCK] Email would be sent to ${opts.to}`);
      return;
    }

    const from = this.config.get<string>("SENDGRID_FROM") ?? "no-reply@formai.fr";
    const formLabels: Record<string, string> = {
      succession: "Déclaration de succession",
      naturalisation: "Demande de naturalisation",
      maprimereno: "MaPrimeRénov'",
    };
    const label = formLabels[opts.formType] ?? opts.formType;

    const msg: sgMail.MailDataRequired = {
      to: opts.to,
      from,
      subject: `FormAI — Votre ${label} est prête`,
      text: `Bonjour ${opts.name},\n\nVotre document a été généré avec succès.\n\nVous trouverez en pièce jointe :\n- Votre ${label} (PDF)\n- Votre lettre d'accompagnement\n\n---\n${opts.letter}\n---\n\nRéférence : ${opts.formId}\n\nCordialement,\nL'équipe FormAI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1d6fdb; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">FormAI</h1>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Bonjour <strong>${opts.name}</strong>,</p>
            <p>Votre <strong>${label}</strong> a été générée avec succès.</p>
            <p>Vous trouverez en pièce jointe votre document PDF prêt à déposer.</p>
            <div style="background: #f9fafb; border-left: 4px solid #1d6fdb; padding: 16px; margin: 24px 0; white-space: pre-line; font-size: 14px; color: #374151;">
${opts.letter}
            </div>
            <p style="font-size: 12px; color: #9ca3af;">Référence : ${opts.formId}</p>
          </div>
        </div>
      `,
      attachments: [
        {
          content: opts.pdfBase64,
          filename: `formai-${opts.formType}-${opts.formId.slice(0, 8)}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);
    this.logger.log(`Email sent to ${opts.to}`);
  }
}
