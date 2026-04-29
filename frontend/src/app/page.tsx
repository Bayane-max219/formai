import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-gray-900 text-xl">FormAI</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Connexion
          </Link>
          <Link
            href="/register"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Commencer
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
            Formulaires administratifs intelligents
          </span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Vos démarches{" "}
            <span className="text-blue-600">simplifiées</span>{" "}
            par l'IA
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Succession, naturalisation, MaPrimeRénov'… Remplissez, payez, et recevez votre
            PDF officiel + lettre d'accompagnement générée par Claude AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Commencer gratuitement →
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-8 max-w-3xl w-full text-left">
          {[
            { icon: "📝", title: "Wizard guidé", desc: "3 étapes claires, validation en temps réel" },
            { icon: "💳", title: "Paiement sécurisé", desc: "Stripe — CB, Apple Pay, Google Pay" },
            { icon: "🤖", title: "Lettre IA", desc: "Claude génère votre lettre d'accompagnement" },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        FormAI · Bayane Miguel Singcol · 2026
      </footer>
    </div>
  );
}
