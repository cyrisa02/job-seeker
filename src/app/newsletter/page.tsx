// src/app/newsletter/page.tsx

import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter | Plateforme Emploi 2026",
  description: "Inscrivez-vous à notre newsletter hebdomadaire",
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">📬 Newsletter hebdomadaire</h1>
        <p className="text-gray-600 mb-6">
          Recevez chaque lundi les nouveaux articles et questions résolues de la
          communauté.
        </p>
        <NewsletterForm />
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
