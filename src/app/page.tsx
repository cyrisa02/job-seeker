// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import { logger } from "@/utils/logger";

export const metadata: Metadata = {
  title: "Plateforme Emploi 2026 - Aide aux demandeurs d'emploi",
  description:
    "Guides, astuces et témoignages pour les demandeurs d'emploi en France",
};

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.log("Home - search query:", q);

  // Récupérer les catégories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  const searchTerm = q?.trim() || "";

  // Requête articles avec recherche
  let articlesQuery = supabase
    .from("articles")
    .select(`id, title, slug, created_at, profiles:author_id (username)`)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);

  if (searchTerm.length > 0) {
    articlesQuery = articlesQuery.or(
      `title.ilike.%${searchTerm}%,content_md.ilike.%${searchTerm}%`,
    );
  }

  const { data: articles } = await articlesQuery;

  // Requête questions avec recherche
  let questionsQuery = supabase
    .from("questions")
    .select(
      `id, title, slug, created_at, is_resolved, profiles:author_id (username)`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  if (searchTerm.length > 0) {
    questionsQuery = questionsQuery.or(
      `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
    );
  }

  const { data: questions } = await questionsQuery;

  logger.log("Home - articles found:", articles?.length);
  logger.log("Home - questions found:", questions?.length);

  const totalResults = (articles?.length || 0) + (questions?.length || 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Plateforme Emploi 2026
          </Link>
          <nav className="flex gap-4 items-center">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  Dashboard
                </Link>
                <Link href="/admin" className="text-gray-600 hover:underline">
                  Admin
                </Link>
              </>
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
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bienvenue sur la plateforme
          </h2>
          <p className="text-blue-100 mb-6">
            Guides, astuces et témoignages pour les demandeurs d'emploi en
            France
          </p>
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {searchTerm && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700">
              {totalResults} résultat{totalResults > 1 ? "s" : ""} pour "
              {searchTerm}"
            </h3>
          </div>
        )}

        {!searchTerm && categories && categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Explorer par thème</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border-l-4 border-blue-600"
                >
                  <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        {articles && articles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {searchTerm ? "Articles correspondants" : "Derniers articles"}
            </h2>
            <div className="grid gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-xl font-semibold text-blue-600 hover:underline block mb-2"
                  >
                    {article.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Par{" "}
                    <Link
                      href={`/profils/${(article.profiles as any)?.username || ""}`}
                      className="text-blue-600 hover:underline"
                    >
                      {(article.profiles as any)?.username || "Anonyme"}
                    </Link>{" "}
                    •{" "}
                    {new Date(article.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Questions */}
        {questions && questions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {searchTerm ? "Questions correspondantes" : "Questions récentes"}
            </h2>
            <div className="space-y-4">
              {questions.map((q) => (
                <Link
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {q.is_resolved && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        ✓ Résolue
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {q.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Par {(q.profiles as any)?.username || "Anonyme"} •{" "}
                    {new Date(q.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Aucun résultat */}
        {totalResults === 0 && searchTerm && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <p className="text-lg mb-2">Aucun résultat pour "{searchTerm}"</p>
            <p className="text-sm">
              Essayez d'autres mots-clés ou parcourez les catégories.
            </p>
          </div>
        )}

        {!searchTerm && (!articles || articles.length === 0) && (
          <p className="text-gray-500 text-center py-12">
            Aucun article publié pour le moment.
          </p>
        )}
      </section>
    </main>
  );
}
