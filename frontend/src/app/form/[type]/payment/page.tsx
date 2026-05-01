"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const FORM_INFO: Record<string, { label: string; price: number; desc: string }> = {
  succession: { label: "Déclaration de succession", price: 19, desc: "Formulaire 2705 + attestation" },
  naturalisation: { label: "Demande de naturalisation", price: 29, desc: "Dossier complet Cerfa 12753" },
  maprimereno: { label: "MaPrimeRénov'", price: 24, desc: "Formulaire de demande d'aide" },
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.type as string;
  const formId = searchParams.get("formId");
  const cancelled = searchParams.get("cancelled");

  const [loading, setLoading] = useState(false);
  const info = FORM_INFO[type];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !formId || !info) router.replace("/dashboard");
  }, [router, formId, info]);

  async function handlePay() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch(`${API}/api/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ formId, type }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error("No redirect URL");
    } catch {
      alert("Erreur lors de la création du paiement. Réessayez.");
      setLoading(false);
    }
  }

  if (!info) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-gray-600">
          ←
        </button>
        <span className="font-semibold text-gray-900">Paiement</span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-md">

          {cancelled && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              Paiement annulé. Vous pouvez réessayer.
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{info.label}</h1>
            <p className="text-sm text-gray-500">{info.desc}</p>
          </div>

          {/* Price breakdown */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Assistance à la rédaction</span>
              <span className="text-gray-900">{info.price} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA (0%)</span>
              <span className="text-gray-900">0,00 €</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600 text-lg">{info.price} €</span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-3 mb-6 text-xs text-gray-500">
            <span className="text-green-500 mt-0.5">🔒</span>
            <span>Paiement sécurisé par Stripe. Vos données bancaires ne sont jamais stockées sur nos serveurs.</span>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Redirection…
              </>
            ) : (
              `Payer ${info.price} € par carte →`
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Powered by Stripe
          </p>
        </div>
      </main>
    </div>
  );
}
