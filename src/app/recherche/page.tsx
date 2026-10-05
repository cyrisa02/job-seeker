// src/app/recherche/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recherche | Plateforme Emploi 2026",
  description: "Rechercher dans les articles et questions",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

const PER_PAGE = 10;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const from = (currentPage - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;
  const query = q?.trim() || "";

  const supabase = await createClient();

  let articles: any[] = [];
  let questions: any[] = [];
  let totalArticles = 0;
  let totalQuestions = 0;

  if (query.length > 0) {
    // Recherche articles
    if (!type || type === "articles") {
      const articlesQuery = supabase
        .from("articles")
        .select(`id, title, slug, created_at, profiles:author_id (username)`, {
          count: "exact",
        })
        .eq("status", "published")
        .textSearch("search_vector", query, {
          type: "websearch",
          config: "french",
        })
        .range(from, to);

      const result = await articlesQuery;
      articles = result.data || [];
      totalArticles = result.count || 0;
    }

    // Recherche questions
    if (!type || type === "questions") {
      const questionsQuery = supabase
        .from("questions")
        .select(
          `id, title, slug, created_at, is_resolved, profiles:author_id (username)`,
          { count: "exact" },
        )
        .eq("status", "published")
        .textSearch("search_vector", query, {
          type: "websearch",
          config: "french",
        })
        .range(from, to);

      const result = await questionsQuery;
      questions = result.data || [];
      totalQuestions = result.count || 0;
    }
  }

  const total = totalArticles + totalQuestions;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-6">Recherche</h1>

        {/* Barre de recherche */}
        <form action="/recherche" method="get" className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Rechercher des articles, questions..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Rechercher
            </button>
          </div>

          {/* Filtres de type */}
          <div className="flex gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value=""
                defaultChecked={!type}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Tout ({total})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="articles"
                defaultChecked={type === "articles"}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Articles ({totalArticles})
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="questions"
                defaultChecked={type === "questions"}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Questions ({totalQuestions})
              </span>
            </label>
          </div>
        </form>

        {/* Résultats */}
        {query && (
          <>
            <p className="text-gray-600 mb-6">
              {total} résultat{total > 1 ? "s" : ""} pour "{query}"
            </p>

            {total === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                <p className="mb-2">Aucun résultat trouvé.</p>
                <p className="text-sm">
                  Astuce : essayez avec moins de mots ou des synonymes.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Articles */}
                {articles.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 text-gray-900">
                      Articles ({totalArticles})
                    </h2>
                    <div className="space-y-3">
                      {articles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.slug}`}
                          className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-lg font-semibold text-blue-600 mb-1">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {(article.profiles as any)?.username || "Anonyme"} •{" "}
                            {new Date(article.created_at).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Questions */}
                {questions.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 text-gray-900">
                      Questions ({totalQuestions})
                    </h2>
                    <div className="space-y-3">
                      {questions.map((q) => (
                        <Link
                          key={q.id}
                          href={`/questions/${q.slug}`}
                          className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {q.is_resolved && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                ✓ Résolue
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {q.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {(q.profiles as any)?.username || "Anonyme"} •{" "}
                            {new Date(q.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <p>Entrez un terme pour lancer une recherche.</p>
          </div>
        )}
      </div>
    </main>
  );
}
