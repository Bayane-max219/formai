"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step2Schema, step2SchemaNaturalisation, step2SchemaMaPrimeReno,
  type Step2Data, type Step2DataNaturalisation, type Step2DataMaPrimeReno,
} from "@/lib/schemas";

type SubProps = {
  defaultValues: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
};

export function Step2({ formType, ...props }: SubProps & { formType: string }) {
  if (formType === "naturalisation") return <Step2Naturalisation {...props} />;
  if (formType === "maprimereno") return <Step2MaPrimeReno {...props} />;
  return <Step2Succession {...props} />;
}

function Step2Succession({ defaultValues, onNext, onBack }: SubProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: defaultValues as Partial<Step2Data>,
  });
  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Informations sur le défunt</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Prénom du défunt" error={errors.defunt_prenom?.message}>
          <input {...register("defunt_prenom")} placeholder="Marie" className={input(!!errors.defunt_prenom)} />
        </Field>
        <Field label="Nom du défunt" error={errors.defunt_nom?.message}>
          <input {...register("defunt_nom")} placeholder="Dupont" className={input(!!errors.defunt_nom)} />
        </Field>
      </div>
      <Field label="Date de décès" error={errors.date_deces?.message}>
        <input {...register("date_deces")} type="date" className={input(!!errors.date_deces)} />
      </Field>
      <Field label="Lieu de décès (ville)" error={errors.lieu_deces?.message}>
        <input {...register("lieu_deces")} placeholder="Paris" className={input(!!errors.lieu_deces)} />
      </Field>
      <Field label="Votre lien de parenté" error={errors.lien_parente?.message}>
        <select {...register("lien_parente")} className={input(!!errors.lien_parente)}>
          <option value="">Sélectionnez...</option>
          <option value="conjoint">Conjoint(e)</option>
          <option value="enfant">Enfant</option>
          <option value="parent">Parent</option>
          <option value="frere_soeur">Frère / Sœur</option>
          <option value="autre">Autre</option>
        </select>
      </Field>
      <Buttons onBack={onBack} />
    </form>
  );
}

function Step2Naturalisation({ defaultValues, onNext, onBack }: SubProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2DataNaturalisation>({
    resolver: zodResolver(step2SchemaNaturalisation),
    defaultValues: defaultValues as Partial<Step2DataNaturalisation>,
  });
  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Votre nationalité</h2>
      <Field label="Pays d'origine / nationalité actuelle" error={errors.pays_origine?.message}>
        <input {...register("pays_origine")} placeholder="Ex : Malgache" className={input(!!errors.pays_origine)} />
      </Field>
      <Field label="Durée de résidence en France" error={errors.duree_residence?.message}>
        <input {...register("duree_residence")} placeholder="Ex : 5 ans" className={input(!!errors.duree_residence)} />
      </Field>
      <Field label="Motif de la demande" error={errors.motif_naturalisation?.message}>
        <select {...register("motif_naturalisation")} className={input(!!errors.motif_naturalisation)}>
          <option value="">Sélectionnez...</option>
          <option value="residence">Résidence prolongée (5+ ans)</option>
          <option value="mariage">Mariage avec un(e) Français(e)</option>
          <option value="service_nation">Service à la Nation française</option>
          <option value="autre">Autre</option>
        </select>
      </Field>
      <Buttons onBack={onBack} />
    </form>
  );
}

function Step2MaPrimeReno({ defaultValues, onNext, onBack }: SubProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2DataMaPrimeReno>({
    resolver: zodResolver(step2SchemaMaPrimeReno),
    defaultValues: defaultValues as Partial<Step2DataMaPrimeReno>,
  });
  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Votre logement</h2>
      <Field label="Type de logement" error={errors.type_logement?.message}>
        <select {...register("type_logement")} className={input(!!errors.type_logement)}>
          <option value="">Sélectionnez...</option>
          <option value="maison">Maison individuelle</option>
          <option value="appartement">Appartement</option>
        </select>
      </Field>
      <Field label="Année de construction" error={errors.annee_construction?.message}>
        <input {...register("annee_construction")} placeholder="Ex : 1985" className={input(!!errors.annee_construction)} />
      </Field>
      <Field label="Type de travaux envisagés" error={errors.type_travaux?.message}>
        <select {...register("type_travaux")} className={input(!!errors.type_travaux)}>
          <option value="">Sélectionnez...</option>
          <option value="isolation">Isolation thermique</option>
          <option value="chauffage">Système de chauffage</option>
          <option value="fenetres">Fenêtres / menuiseries</option>
          <option value="autre">Autre</option>
        </select>
      </Field>
      <Buttons onBack={onBack} />
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Buttons({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex gap-3 pt-4">
      <button type="button" onClick={onBack}
        className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
        ← Retour
      </button>
      <button type="submit"
        className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
        Continuer →
      </button>
    </div>
  );
}

function input(hasError: boolean) {
  return `w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;
}
