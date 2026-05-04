"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1Data } from "@/lib/schemas";

type Props = { defaultValues: Partial<Step1Data>; onNext: (data: Step1Data) => void };

export function Step1({ defaultValues, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Vos informations personnelles</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Prénom" error={errors.prenom?.message}>
          <input {...register("prenom")} placeholder="Jean" className={input(!!errors.prenom)} />
        </Field>
        <Field label="Nom" error={errors.nom?.message}>
          <input {...register("nom")} placeholder="Dupont" className={input(!!errors.nom)} />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="jean@exemple.fr" className={input(!!errors.email)} />
      </Field>

      <Field label="Téléphone" error={errors.telephone?.message}>
        <input {...register("telephone")} placeholder="+33 6 12 34 56 78" className={input(!!errors.telephone)} />
      </Field>

      <Field label="Adresse" error={errors.adresse?.message}>
        <input {...register("adresse")} placeholder="12 rue de la Paix" className={input(!!errors.adresse)} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Ville" error={errors.ville?.message}>
          <input {...register("ville")} placeholder="Paris" className={input(!!errors.ville)} />
        </Field>
        <Field label="Code postal" error={errors.code_postal?.message}>
          <input {...register("code_postal")} placeholder="75001" className={input(!!errors.code_postal)} />
        </Field>
      </div>

      <div className="pt-4">
        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
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
  return `w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;
}
