"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FORMS = [
  {
    id: "succession",
    label: "Déclaration de succession",
    price: 19,
    image: "/images/succession.jpg",
    desc: "Déclarez une succession et obtenez votre dossier complet.",
  },
  {
    id: "naturalisation",
    label: "Demande de naturalisation",
    price: 29,
    image: "/images/naturalisation.jpg",
    desc: "Constituez votre dossier de naturalisation française.",
  },
  {
    id: "maprimereno",
    label: "MaPrimeRénov'",
    price: 24,
    image: "/images/maprimereno.jpg",
    desc: "Demandez votre aide à la rénovation énergétique.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { router.replace("/login"); return; }
    setToken(t);
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-gray-900 text-lg">FormAI</span>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
          Déconnexion
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vos formulaires administratifs
          </h1>
          <p className="text-gray-500">
            Remplissez, générez et téléchargez vos documents officiels en quelques clics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FORMS.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/form/${f.id}`)}
            >
              <div className="relative w-full h-40">
                <Image
                  src={f.image}
                  alt={f.label}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-1">{f.label}</h3>
                <p className="text-xs text-gray-400 mb-4">{f.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">{f.price} €</span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    PDF + lettre IA
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h2>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Choisissez votre formulaire</li>
            <li>Remplissez le wizard en 3 étapes</li>
            <li>Payez en ligne (Stripe)</li>
            <li>Téléchargez votre PDF + lettre d'accompagnement générée par IA</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
