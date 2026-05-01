import { Injectable } from "@nestjs/common";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Form } from "../forms/form.entity";

const TITLES: Record<string, string> = {
  succession: "DÉCLARATION DE SUCCESSION",
  naturalisation: "DEMANDE DE NATURALISATION",
  maprimereno: "MAPRIMERÉNOV' — DEMANDE D'AIDE",
};

@Injectable()
export class PdfService {
  async generate(form: Form): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();
    const d = form.data as Record<string, string>;
    let y = height - 60;

    const text = (str: string, x: number, size = 10, isBold = false, color = rgb(0, 0, 0)) => {
      page.drawText(str, { x, y, size, font: isBold ? bold : font, color });
    };

    const row = (label: string, value: string) => {
      text(`${label} :`, 50, 10, true);
      text(value || "—", 210, 10);
      y -= 20;
    };

    const section = (title: string) => {
      y -= 8;
      page.drawRectangle({ x: 50, y: y - 4, width: width - 100, height: 22, color: rgb(0.94, 0.96, 1) });
      text(title, 55, 11, true, rgb(0.1, 0.4, 0.9));
      y -= 28;
    };

    // Header band
    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.1, 0.4, 0.9) });
    page.drawText("FormAI", { x: 50, y: height - 38, size: 24, font: bold, color: rgb(1, 1, 1) });
    page.drawText(TITLES[form.type] ?? form.type.toUpperCase(), {
      x: 50, y: height - 62, size: 12, font, color: rgb(0.8, 0.88, 1),
    });

    y = height - 108;

    section("INFORMATIONS DU DEMANDEUR");
    row("Nom complet", `${d.prenom ?? ""} ${d.nom ?? ""}`.trim());
    row("Email", d.email ?? "");
    row("Téléphone", d.telephone ?? "");
    row("Adresse", `${d.adresse ?? ""}, ${d.code_postal ?? ""} ${d.ville ?? ""}`.trim());

    section("INFORMATIONS DU DÉFUNT");
    row("Nom complet", `${d.defunt_prenom ?? ""} ${d.defunt_nom ?? ""}`.trim());
    row("Date de décès", d.date_deces ?? "");
    row("Lieu de décès", d.lieu_deces ?? "");
    row("Lien de parenté", d.lien_parente ?? "");

    section("DÉTAILS DE LA SUCCESSION");
    row("Valeur estimée", `${d.valeur_succession ?? "0"} €`);
    row("Biens immobiliers", d.biens_immobiliers === "true" ? "Oui" : "Non");
    row("Comptes bancaires", d.comptes_bancaires === "true" ? "Oui" : "Non");

    // Footer
    page.drawLine({
      start: { x: 50, y: 52 }, end: { x: width - 50, y: 52 },
      thickness: 0.5, color: rgb(0.8, 0.8, 0.8),
    });
    y = 38;
    text(`Document généré par FormAI — ${new Date().toLocaleDateString("fr-FR")}`, 50, 9, false, rgb(0.5, 0.5, 0.5));
    y = 38;
    text(`Réf: ${form.id}`, width - 220, 9, false, rgb(0.5, 0.5, 0.5));

    return doc.save();
  }
}
