// src/app/questions/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import { logger } from "@/utils/logger"; // ← AJOUT

export const metadata: Metadata = {
  title: "Questions de la communauté | Plateforme Emploi 2026",
  description: "Posez vos questions et trouvez des réponses de la communauté",
};

export default async function QuestionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: questions } = await supabase
    .from("questions")
    .select(
      `
      id, title, slug, is_resolved, created_at,
      categories!left (name, slug),
      profiles:author_id (username),
      answers (id, status)
    `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  logger.log("QuestionsPage - questions:", questions?.length);

  // Compter les réponses approuvées par question
  const questionsWithCounts =
    questions?.map((q) => ({
      ...q,
      answersCount:
        (q.answers as any[])?.filter((a: any) => a.status === "approved")
          .length || 0,
    })) || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Plateforme Emploi 2026</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="text-gray-600 hover:underline">
              Accueil
            </Link>
            {user ? (
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Questions de la communauté</h2>
            <p className="text-gray-600 mt-2">
              {questionsWithCounts.length} question
              {questionsWithCounts.length > 1 ? "s" : ""} posée
              {questionsWithCounts.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href={user ? "/questions/poser" : "/auth/login"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Poser une question
          </Link>
        </div>

        {questionsWithCounts.length > 0 ? (
          <div className="space-y-4">
            {questionsWithCounts.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <span
                      className={`text-2xl font-bold ${q.is_resolved ? "text-green-600" : "text-gray-400"}`}
                    >
                      {q.answersCount}
                    </span>
                    <span className="text-xs text-gray-500">
                      réponse{q.answersCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {q.is_resolved && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          ✓ Résolue
                        </span>
                      )}
                      {(q.categories as any)?.slug && (
                        <Link
                          href={`/categories/${(q.categories as any).slug}`}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-200"
                        >
                          {(q.categories as any).name}
                        </Link>
                      )}
                    </div>
                    <Link
                      href={`/questions/${q.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 block mb-1"
                    >
                      {q.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Par {(q.profiles as any)?.username || "Anonyme"} •{" "}
                      {new Date(q.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">
              Aucune question pour le moment.
            </p>
            <p className="text-gray-400 text-sm">
              Soyez le premier à poser une question !
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
