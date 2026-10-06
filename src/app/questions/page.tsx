// src/app/questions/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import QuestionsFilters from "@/components/QuestionsFilters";
import Pagination from "@/components/Pagination";

const QUESTIONS_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Questions de la communauté | Allié Emploi",
  description:
    "Posez vos questions sur l'emploi et le chômage, ou consultez celles de la communauté. Rupture conventionnelle, ARE, RSA, recherche d'emploi...",
  keywords: [
    "questions emploi",
    "entraide chômage",
    "rupture conventionnelle",
    "droits chômage",
    "communauté demandeurs emploi",
  ],
};

interface QuestionsPageProps {
  searchParams: Promise<{
    categorie?: string;
    statut?: string;
    page?: string;
  }>;
}

export default async function QuestionsPage({
  searchParams,
}: QuestionsPageProps) {
  const { categorie, statut, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const from = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const to = from + QUESTIONS_PER_PAGE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Construction dynamique de la requête avec count
  let query = supabase
    .from("questions")
    .select(
      `id, title, slug, is_resolved, created_at,
       categories!left (name, slug),
       profiles:author_id (username),
       answers (id, status)`,
      { count: "exact" },
    )
    .eq("status", "published");

  if (categorie) {
    query = query.eq("categories.slug", categorie);
  }
  if (statut === "resolue") {
    query = query.eq("is_resolved", true);
  } else if (statut === "ouverte") {
    query = query.eq("is_resolved", false);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data: questions, count: totalQuestions } = await query;

  const totalPages = Math.ceil((totalQuestions || 0) / QUESTIONS_PER_PAGE);

  const questionsWithCounts =
    questions?.map((q) => ({
      ...q,
      answersCount:
        (q.answers as any[])?.filter((a: any) => a.status === "approved")
          .length || 0,
    })) || [];

  // 2. Catégories pour les filtres
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  // Params à conserver dans la pagination (exclure "page")
  const filterParams: Record<string, string> = {};
  if (categorie) filterParams.categorie = categorie;
  if (statut) filterParams.statut = statut;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Allié Emploi
          </Link>
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
              {totalQuestions || 0} question
              {(totalQuestions || 0) > 1 ? "s" : ""} au total
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/questions/guide"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-1"
            >
              📖 Guide
            </Link>
            <Link
              href={user ? "/questions/poser" : "/auth/login"}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Poser une question
            </Link>
          </div>
        </div>

        <QuestionsFilters categories={categories || []} />

        {questionsWithCounts.length > 0 ? (
          <div className="space-y-4">
            {questionsWithCounts.map((q) => (
              <Link
                key={q.id}
                href={`/questions/${q.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <span
                      className={`text-2xl font-bold ${
                        q.is_resolved ? "text-green-600" : "text-gray-400"
                      }`}
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
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          {(q.categories as any).name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {q.title}
                    </h3>
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">
              Aucune question ne correspond à ces filtres.
            </p>
            <Link href="/questions" className="text-blue-600 hover:underline">
              Voir toutes les questions
            </Link>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/questions"
          searchParams={filterParams}
        />
      </section>
    </main>
  );
}
