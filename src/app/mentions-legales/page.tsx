// src/app/mentions-legales/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Plateforme Emploi 2026",
  description: "Mentions légales de la plateforme",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
          <p className="text-gray-700">
            Le site <strong>Plateforme Emploi 2026</strong> est édité par :
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
            <li>Nom : Cyril Gourdon</li>
            <li>Email : cyril.gourdon.02@gmail.com</li>
            <li>Statut : Auto-entrepreneur (en cours de création)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Hébergement</h2>
          <p className="text-gray-700">Le site est hébergé par :</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
            <li>Vercel Inc. (États-Unis)</li>
            <li>Supabase Inc. (États-Unis) pour la base de données</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Propriété intellectuelle
          </h2>
          <p className="text-gray-700">
            Les contenus publiés sur la plateforme (articles, questions,
            réponses) restent la propriété de leurs auteurs respectifs. En
            publiant, vous accordez à la plateforme une licence non-exclusive de
            diffusion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-gray-700">
            Pour toute question relative au site, contactez-nous à :{" "}
            <a
              href="mailto:cyril.gourdon.02@gmail.com"
              className="text-blue-600 hover:underline"
            >
              cyril.gourdon.02@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
