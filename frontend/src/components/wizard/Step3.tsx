"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step3Schema, step3SchemaNaturalisation, step3SchemaMaPrimeReno,
  type Step3Data, type Step3DataNaturalisation, type Step3DataMaPrimeReno,
} from "@/lib/schemas";

type CommonProps = {
  defaultValues: Record<string, unknown>;
  summary: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  loading: boolean;
};

export function Step3({ formType, ...props }: CommonProps & { formType: string }) {
  if (formType === "naturalisation") return <Step3Naturalisation {...props} />;
  if (formType === "maprimereno") return <Step3MaPrimeReno {...props} />;
  return <Step3Succession {...props} />;
}

function Step3Succession({ defaultValues, summary: s, onNext, onBack, loading }: CommonProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: defaultValues as Partial<Step3Data>,
  });
  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif & confirmation</h2>
      <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <div className="font-semibold text-gray-700 mb-2">Vos informations</div>
        <Row label="Nom complet" value={`${s.prenom ?? ""} ${s.nom ?? ""}`} />
        <Row label="Email" value={String(s.email ?? "")} />
        <Row label="Adresse" value={`${s.adresse ?? ""}, ${s.code_postal ?? ""} ${s.ville ?? ""}`} />
        <div className="border-t border-gray-200 pt-3 mt-3 font-semibold text-gray-700">Le défunt</div>
        <Row label="Nom complet" value={`${s.defunt_prenom ?? ""} ${s.defunt_nom ?? ""}`} />
        <Row label="Date de décès" value={String(s.date_deces ?? "")} />
        <Row label="Lieu de décès" value={String(s.lieu_deces ?? "")} />
        <Row label="Lien de parenté" value={String(s.lien_parente ?? "")} />
      </div>
      <Field label="Valeur estimée de la succession (€)" error={errors.valeur_succession?.message}>
        <input {...register("valeur_succession")} type="number" placeholder="Ex: 150000"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.valeur_succession ? "border-red-300" : "border-gray-200"}`} />
      </Field>
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input {...register("biens_immobiliers")} type="checkbox" className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-700">La succession comprend des biens immobiliers</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input {...register("comptes_bancaires")} type="checkbox" className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-700">La succession comprend des comptes bancaires</span>
        </label>
      </div>
      <Cgu error={errors.accepte_conditions?.message} registerField={register("accepte_conditions")} />
      <SubmitButtons onBack={onBack} loading={loading} />
    </form>
  );
}

function Step3Naturalisation({ defaultValues, summary: s, onNext, onBack, loading }: CommonProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3DataNaturalisation>({
    resolver: zodResolver(step3SchemaNaturalisation),
    defaultValues: defaultValues as Partial<Step3DataNaturalisation>,
  });
  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif & confirmation</h2>
      <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <div className="font-semibold text-gray-700 mb-2">Vos informations</div>
        <Row label="Nom complet" value={`${s.prenom ?? ""} ${s.nom ?? ""}`} />
        <Row label="Email" value={String(s.email ?? "")} />
        <Row label="Adresse" value={`${s.adresse ?? ""}, ${s.code_postal ?? ""} ${s.ville ?? ""}`} />
        <div className="border-t border-gray-200 pt-3 mt-3 font-semibold text-gray-700">Nationalité</div>
        <Row label="Pays d'origine" value={String(s.pays_origine ?? "")} />
        <Row label="Résidence en France" value={String(s.duree_residence ?? "")} />
        <Row label="Motif" value={String(s.motif_naturalisation ?? "")} />
      </div>
      <Cgu error={errors.accepte_conditions?.message} registerField={register("accepte_conditions")} />
      <SubmitButtons onBack={onBack} loading={loading} />
    </form>
  );
}

function Step3MaPrimeReno({ defaultValues, summary: s, onNext, onBack, loading }: CommonProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3DataMaPrimeReno>({
    resolver: zodResolver(step3SchemaMaPrimeReno),
    defaultValues: defaultValues as Partial<Step3DataMaPrimeReno>,
  });
  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif & confirmation</h2>
      <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <div className="font-semibold text-gray-700 mb-2">Vos informations</div>
        <Row label="Nom complet" value={`${s.prenom ?? ""} ${s.nom ?? ""}`} />
        <Row label="Email" value={String(s.email ?? "")} />
        <Row label="Adresse" value={`${s.adresse ?? ""}, ${s.code_postal ?? ""} ${s.ville ?? ""}`} />
        <div className="border-t border-gray-200 pt-3 mt-3 font-semibold text-gray-700">Votre logement</div>
        <Row label="Type" value={String(s.type_logement ?? "")} />
        <Row label="Année de construction" value={String(s.annee_construction ?? "")} />
        <Row label="Travaux envisagés" value={String(s.type_travaux ?? "")} />
      </div>
      <Field label="Budget estimé des travaux (€)" error={errors.budget_travaux?.message}>
        <input {...register("budget_travaux")} type="number" placeholder="Ex: 8000"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.budget_travaux ? "border-red-300" : "border-gray-200"}`} />
      </Field>
      <Cgu error={errors.accepte_conditions?.message} registerField={register("accepte_conditions")} />
      <SubmitButtons onBack={onBack} loading={loading} />
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

function Cgu({ error, registerField }: { error?: string; registerField: object }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input {...registerField} type="checkbox" className="w-4 h-4 rounded mt-0.5" />
        <span className="text-sm text-gray-600">
          J&apos;accepte les conditions générales et certifie l&apos;exactitude des informations fournies.
        </span>
      </label>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function SubmitButtons({ onBack, loading }: { onBack: () => void; loading: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onBack}
        className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
        ← Retour
      </button>
      <button type="submit" disabled={loading}
        className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
        {loading ? "Enregistrement…" : "Procéder au paiement →"}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}
