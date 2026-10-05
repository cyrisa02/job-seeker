// src/app/questions/poser/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import AskQuestionForm from "@/components/AskQuestionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poser une question | Plateforme Emploi 2026",
  description: "Partagez votre question avec la communauté",
};

export default async function AskQuestionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Récupérer les catégories pour le formulaire
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/questions"
            className="text-blue-600 hover:underline mb-8 inline-block"
          >
            ← Retour aux questions
          </Link>

          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-4">
              Connectez-vous pour poser une question
            </h1>
            <p className="text-gray-600 mb-6">
              La connexion vous permet de suivre les réponses à votre question
              et de participer à la communauté.
            </p>
            <Link
              href={`/auth/login?redirect=/questions/poser`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Se connecter
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Pas encore de compte ?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/questions"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour aux questions
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Poser une question</h1>
          <p className="text-gray-600 mb-8">
            Partagez votre question avec la communauté. Elle sera publiée après
            modération.
          </p>

          <AskQuestionForm userId={user.id} categories={categories || []} />
        </div>
      </div>
    </main>
  );
}
