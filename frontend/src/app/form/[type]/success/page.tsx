"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.type as string;
  const sessionId = searchParams.get("session_id");
  const formId = searchParams.get("formId");

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [letter, setLetter] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !formId) {
      router.replace("/dashboard");
      return;
    }

    const token = localStorage.getItem("token") ?? "";

    fetch(`${API}/api/payments/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sessionId, formId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.pdfBase64) {
          setPdfBase64(data.pdfBase64);
          setLetter(data.letter ?? null);
          setStatus("done");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId, formId, router]);

  function downloadPdf() {
    if (!pdfBase64) return;
    const binary = atob(pdfBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formai-${type}-${formId?.slice(0, 8)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {status === "loading" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Génération en cours…</h1>
            <p className="text-sm text-gray-500">
              L'IA prépare votre document et votre lettre d'accompagnement.
            </p>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-6">
            {/* Success banner */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Paiement confirmé !</h1>
              <p className="text-sm text-gray-500 mb-6">
                Votre document a été généré et envoyé à votre adresse email.
              </p>
              <button
                onClick={downloadPdf}
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors mb-3"
              >
                Télécharger le PDF
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>

            {/* AI-generated letter */}
            {letter && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Lettre d'accompagnement générée par IA
                  </h2>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-xl p-5">
                  {letter}
                </pre>
                <p className="text-xs text-gray-400 mt-3">
                  Cette lettre est incluse dans l'email envoyé à votre adresse.
                </p>
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Une erreur est survenue</h1>
            <p className="text-sm text-gray-500 mb-8">
              Impossible de confirmer le paiement. Contactez le support si vous avez été débité.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
