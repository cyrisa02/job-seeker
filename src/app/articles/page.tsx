// src/app/articles/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import ArticlesFilters from "@/components/ArticlesFilters";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/NavBar";

const ARTICLES_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Articles - Guides et conseils emploi | Allié Emploi",
  description:
    "Parcourez tous nos articles sur le chômage, les droits, le CV, les entretiens et la reconversion professionnelle. Filtrez par catégorie.",
  keywords: [
    "articles emploi",
    "guide chômage",
    "droits ARE",
    "conseils CV",
    "reconversion professionnelle",
  ],
};

interface ArticlesPageProps {
  searchParams: Promise<{
    categorie?: string;
    tri?: string;
    page?: string;
  }>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const { categorie, tri, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Construction dynamique de la requête
  let query = supabase
    .from("articles")
    .select(
      `id, title, slug, created_at, category_id,
       categories!left (name, slug),
       profiles:author_id (username)`,
      { count: "exact" },
    )
    .eq("status", "published");

  if (categorie) {
    query = query.eq("categories.slug", categorie);
  }

  // Tri
  if (tri === "ancien") {
    query = query.order("created_at", { ascending: true });
  } else if (tri === "titre") {
    query = query.order("title", { ascending: true });
  } else {
    // Par défaut : plus récents
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data: articles, count: totalArticles } = await query;
  const totalPages = Math.ceil((totalArticles || 0) / ARTICLES_PER_PAGE);

  // 2. Catégories pour le filtre
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  // Params à conserver dans la pagination
  const filterParams: Record<string, string> = {};
  if (categorie) filterParams.categorie = categorie;
  if (tri) filterParams.tri = tri;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar user={user} currentPage="articles" />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Articles</h1>
          <p className="text-gray-600">
            {totalArticles || 0} article{(totalArticles || 0) > 1 ? "s" : ""}{" "}
            publié{(totalArticles || 0) > 1 ? "s" : ""}
          </p>
        </div>

        {/* Barre de filtres */}
        <ArticlesFilters
          categories={categories || []}
          currentCategorie={categorie || ""}
          currentTri={tri || ""}
        />

        {/* Liste des articles */}
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
              >
                {(article.categories as any)?.name && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mb-3">
                    {(article.categories as any).name}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {(article.profiles as any)?.username || "Anonyme"} •{" "}
                  {new Date(article.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">
              {categorie
                ? `Aucun article dans cette catégorie.`
                : "Aucun article publié pour le moment."}
            </p>
            <Link href="/articles" className="text-blue-600 hover:underline">
              Voir tous les articles
            </Link>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/articles"
          searchParams={filterParams}
        />
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          © 2026 Allié Emploi. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
