"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Data } from "@/lib/schemas";

type Props = {
  defaultValues: Partial<Step2Data>;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
};

export function Step2({ defaultValues, onNext, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
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

function input(hasError: boolean) {
  return `w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;
}
