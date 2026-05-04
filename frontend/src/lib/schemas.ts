import { z } from "zod";

export const step1Schema = z.object({
  prenom: z.string().min(2, "Prénom requis (min 2 caractères)"),
  nom: z.string().min(2, "Nom requis (min 2 caractères)"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Téléphone invalide"),
  adresse: z.string().min(5, "Adresse requise"),
  ville: z.string().min(2, "Ville requise"),
  code_postal: z.string().min(3, "Code postal requis"),
});

// Succession
export const step2Schema = z.object({
  defunt_prenom: z.string().min(2, "Prénom du défunt requis"),
  defunt_nom: z.string().min(2, "Nom du défunt requis"),
  date_deces: z.string().min(1, "Date de décès requise"),
  lieu_deces: z.string().min(2, "Lieu de décès requis"),
  lien_parente: z.enum(["conjoint", "enfant", "parent", "frere_soeur", "autre"], {
    error: "Sélectionnez votre lien de parenté",
  }),
});

export const step3Schema = z.object({
  valeur_succession: z.string().min(1, "Valeur estimée requise"),
  biens_immobiliers: z.boolean(),
  comptes_bancaires: z.boolean(),
  accepte_conditions: z.literal(true, {
    error: "Vous devez accepter les conditions",
  }),
});

// Naturalisation
export const step2SchemaNaturalisation = z.object({
  pays_origine: z.string().min(2, "Pays d'origine requis"),
  duree_residence: z.string().min(1, "Durée de résidence requise"),
  motif_naturalisation: z.enum(["residence", "mariage", "service_nation", "autre"], {
    error: "Sélectionnez un motif",
  }),
});

export const step3SchemaNaturalisation = z.object({
  accepte_conditions: z.literal(true, {
    error: "Vous devez accepter les conditions",
  }),
});

// MaPrimeRénov'
export const step2SchemaMaPrimeReno = z.object({
  type_logement: z.enum(["maison", "appartement"], {
    error: "Sélectionnez un type de logement",
  }),
  annee_construction: z.string().min(4, "Année de construction requise"),
  type_travaux: z.enum(["isolation", "chauffage", "fenetres", "autre"], {
    error: "Sélectionnez un type de travaux",
  }),
});

export const step3SchemaMaPrimeReno = z.object({
  budget_travaux: z.string().min(1, "Budget estimé requis"),
  accepte_conditions: z.literal(true, {
    error: "Vous devez accepter les conditions",
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step2DataNaturalisation = z.infer<typeof step2SchemaNaturalisation>;
export type Step3DataNaturalisation = z.infer<typeof step3SchemaNaturalisation>;
export type Step2DataMaPrimeReno = z.infer<typeof step2SchemaMaPrimeReno>;
export type Step3DataMaPrimeReno = z.infer<typeof step3SchemaMaPrimeReno>;

export type FormData = Step1Data & Step2Data & Step3Data;
