import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const FORM_CONTEXT: Record<string, string> = {
  succession: "déclaration de succession auprès des services fiscaux",
  naturalisation: "demande de naturalisation française auprès du Ministère de l'Intérieur",
  maprimereno: "demande d'aide MaPrimeRénov' auprès de l'Agence Nationale de l'Habitat (ANAH)",
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private config: ConfigService) {}

  async generateLetter(formType: string, data: Record<string, unknown>): Promise<string> {
    const apiKey = this.config.get<string>("OPENROUTER_API_KEY");
    const model = this.config.get<string>("OPENROUTER_MODEL") ?? "anthropic/claude-3-haiku";

    if (!apiKey || apiKey.includes("REPLACE")) {
      this.logger.warn("OpenRouter API key not set — returning placeholder letter");
      return this.placeholderLetter(formType, data);
    }

    const context = FORM_CONTEXT[formType] ?? formType;
    const d = data as Record<string, string>;

    const prompt = `Tu es un assistant administratif français. Rédige une lettre d'accompagnement formelle et professionnelle pour une ${context}.

Informations du demandeur :
- Nom complet : ${d.prenom ?? ""} ${d.nom ?? ""}
- Email : ${d.email ?? ""}
- Adresse : ${d.adresse ?? ""}, ${d.code_postal ?? ""} ${d.ville ?? ""}
${formType === "succession" ? `
Informations sur le défunt :
- Nom : ${d.defunt_prenom ?? ""} ${d.defunt_nom ?? ""}
- Date de décès : ${d.date_deces ?? ""}
- Lieu de décès : ${d.lieu_deces ?? ""}
- Lien de parenté : ${d.lien_parente ?? ""}
- Valeur estimée de la succession : ${d.valeur_succession ?? ""} €` : ""}

La lettre doit :
- Être formelle et respecter les conventions administratives françaises
- Inclure la date du jour (${new Date().toLocaleDateString("fr-FR")})
- Faire référence au document joint
- Être concise (150-200 mots maximum)
- Ne pas inclure de balises HTML ni de markdown

Rédige uniquement la lettre, sans explication.`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://formai.vercel.app",
          "X-Title": "FormAI",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        this.logger.error(`OpenRouter error: ${res.status}`);
        return this.placeholderLetter(formType, data);
      }

      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return json.choices?.[0]?.message?.content ?? this.placeholderLetter(formType, data);
    } catch (err) {
      this.logger.error("OpenRouter fetch failed", err);
      return this.placeholderLetter(formType, data);
    }
  }

  private placeholderLetter(formType: string, data: Record<string, unknown>): string {
    const d = data as Record<string, string>;
    const context = FORM_CONTEXT[formType] ?? formType;
    return `${d.ville ?? "Paris"}, le ${new Date().toLocaleDateString("fr-FR")}

${d.prenom ?? ""} ${d.nom ?? ""}
${d.adresse ?? ""}
${d.code_postal ?? ""} ${d.ville ?? ""}

À l'attention des services compétents,

Madame, Monsieur,

J'ai l'honneur de vous adresser ci-joint mon dossier complet relatif à ma ${context}.

Je certifie l'exactitude des informations fournies et reste à votre disposition pour tout renseignement complémentaire.

Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${d.prenom ?? ""} ${d.nom ?? ""}`;
  }
}
