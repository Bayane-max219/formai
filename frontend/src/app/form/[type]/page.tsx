"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProgressBar } from "@/components/wizard/ProgressBar";
import { Step1 } from "@/components/wizard/Step1";
import { Step2 } from "@/components/wizard/Step2";
import { Step3 } from "@/components/wizard/Step3";
import type { Step1Data, Step2Data, Step3Data, FormData } from "@/lib/schemas";

const FORM_LABELS: Record<string, { label: string; price: number }> = {
  succession: { label: "Déclaration de succession", price: 19 },
  naturalisation: { label: "Demande de naturalisation", price: 29 },
  maprimereno: { label: "MaPrimeRénov'", price: 24 },
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function FormPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<FormData>>({});
  const [formId, setFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formInfo = FORM_LABELS[type];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    if (!formInfo) router.replace("/dashboard");
  }, [router, formInfo]);

  function getToken() {
    return localStorage.getItem("token") ?? "";
  }

  async function handleStep1(step1: Step1Data) {
    setData((prev) => ({ ...prev, ...step1 }));
    setStep(2);
  }

  async function handleStep2(step2: Step2Data) {
    setData((prev) => ({ ...prev, ...step2 }));
    setStep(3);
  }

  async function handleStep3(step3: Step3Data) {
    setLoading(true);
    const fullData = { ...data, ...step3 };
    try {
      if (!formId) {
        // Première soumission → créer le formulaire
        const res = await fetch(`${API}/api/forms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ type, data: fullData }),
        });
        const form = await res.json();
        setFormId(form.id);
        // Jour 3 : redirect vers Stripe checkout
        router.push(`/form/${type}/payment?formId=${form.id}`);
      }
    } catch {
      alert("Erreur lors de l'enregistrement. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (!formInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-gray-600">
          ←
        </button>
        <div>
          <span className="font-semibold text-gray-900">{formInfo.label}</span>
          <span className="ml-3 text-sm font-bold text-blue-600">{formInfo.price} €</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-10">
        <ProgressBar current={step} total={3} />

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {step === 1 && (
            <Step1
              defaultValues={data as Partial<Step1Data>}
              onNext={handleStep1}
            />
          )}
          {step === 2 && (
            <Step2
              defaultValues={data as Partial<Step2Data>}
              onNext={handleStep2}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3
              defaultValues={data as Partial<Step3Data>}
              summary={data}
              onNext={handleStep3}
              onBack={() => setStep(2)}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
