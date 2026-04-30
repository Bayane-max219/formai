"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, type Step3Data, type Step1Data, type Step2Data } from "@/lib/schemas";

type Props = {
  defaultValues: Partial<Step3Data>;
  summary: Partial<Step1Data & Step2Data>;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  loading: boolean;
};

export function Step3({ defaultValues, summary, onNext, onBack, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif & confirmation</h2>

      {/* Résumé */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <div className="font-semibold text-gray-700 mb-2">Vos informations</div>
        <Row label="Nom complet" value={`${summary.prenom ?? ""} ${summary.nom ?? ""}`} />
        <Row label="Email" value={summary.email ?? ""} />
        <Row label="Adresse" value={`${summary.adresse ?? ""}, ${summary.code_postal ?? ""} ${summary.ville ?? ""}`} />
        <div className="border-t border-gray-200 pt-3 mt-3 font-semibold text-gray-700">Le défunt</div>
        <Row label="Nom complet" value={`${summary.defunt_prenom ?? ""} ${summary.defunt_nom ?? ""}`} />
        <Row label="Date de décès" value={summary.date_deces ?? ""} />
        <Row label="Lieu de décès" value={summary.lieu_deces ?? ""} />
        <Row label="Lien de parenté" value={summary.lien_parente ?? ""} />
      </div>

      {/* Valeur succession */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valeur estimée de la succession (€)
        </label>
        <input
          {...register("valeur_succession")}
          type="number"
          placeholder="Ex: 150000"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.valeur_succession ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.valeur_succession && (
          <p className="text-xs text-red-500 mt-1">{errors.valeur_succession.message}</p>
        )}
      </div>

      {/* Checkboxes */}
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

      {/* CGU */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input {...register("accepte_conditions")} type="checkbox" className="w-4 h-4 rounded mt-0.5" />
          <span className="text-sm text-gray-600">
            J'accepte les conditions générales et certifie l'exactitude des informations fournies.
          </span>
        </label>
        {errors.accepte_conditions && (
          <p className="text-xs text-red-500 mt-1">{errors.accepte_conditions.message}</p>
        )}
      </div>

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
    </form>
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
