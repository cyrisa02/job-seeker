// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import NewsletterForm from "@/components/NewsletterForm";
import { logger } from "@/utils/logger";
import Pagination from "@/components/Pagination";
import { logout } from "@/app/auth/actions";

const ARTICLES_PER_PAGE = 6;

interface HomeProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: "Plateforme Emploi 2026 - Aide aux demandeurs d'emploi",
  description:
    "Guides, astuces et témoignages pour les demandeurs d'emploi en France",
};

export default async function Home({ searchParams }: HomeProps) {
  const { q, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  const searchTerm = q?.trim() || "";

  // Remplace le bloc de recherche articles par :

  let articlesQuery = supabase
    .from("articles")
    .select(`id, title, slug, created_at, profiles:author_id (username)`, {
      count: "exact",
    })
    .eq("status", "published");

  if (searchTerm.length > 0) {
    // Utiliser la recherche full-text au lieu de ILIKE
    articlesQuery = articlesQuery.textSearch("search_vector", searchTerm, {
      type: "websearch", // supporte les opérateurs : "phrase exacte", OR, -exclusion
      config: "french",
    });
  }

  articlesQuery = articlesQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: articles, count: totalArticles } = await articlesQuery;
  const totalPages = Math.ceil((totalArticles || 0) / ARTICLES_PER_PAGE);

  logger.log("Home - articles found:", articles?.length);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Plateforme Emploi 2026
          </Link>
          <nav className="flex gap-4 items-center">
            <Link
              href="/questions"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Questions
            </Link>
            <Link
              href="/stats"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Stats
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Admin
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Se déconnecter
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Bienvenue sur la plateforme
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl">
            Guides, astuces et témoignages pour les demandeurs d'emploi en
            France. Une communauté bienveillante pour vous accompagner.
          </p>
          <div className="max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Résultat de recherche */}
        {searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {articles?.length || 0} résultat
              {(articles?.length || 0) > 1 ? "s" : ""} pour "{searchTerm}"
            </h2>
          </div>
        )}

        {/* Catégories */}
        {!searchTerm && categories && categories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Explorer par thème
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchTerm ? "Articles correspondants" : "Derniers articles"}
          </h2>
          {articles && articles.length > 0 ? (
            <div className="grid gap-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Par {(article.profiles as any)?.username || "Anonyme"} •{" "}
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
              <p className="text-gray-500">
                {searchTerm
                  ? `Aucun résultat pour "${searchTerm}". Essayez d'autres mots-clés.`
                  : "Aucun article publié pour le moment."}
              </p>
            </div>
          )}
        </section>

        {/* Newsletter */}
        {!searchTerm && (
          <section className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-3xl">📬</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Restez informé(e)
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Recevez chaque lundi les nouveaux articles et questions
                  résolues de la communauté.
                </p>
                <div className="max-w-md mx-auto">
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/"
        searchParams={searchTerm ? { q: searchTerm } : {}}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">
                Plateforme Emploi 2026
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Communauté d'entraide pour les demandeurs d'emploi en France.
                Partagez, apprenez, progressez ensemble.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/questions"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Questions de la communauté
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stats"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Statistiques
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cgu"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    CGU
                  </Link>
                </li>
                <li>
                  <Link
                    href="/confidentialite"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            © 2026 Plateforme Emploi 2026. Tous droits réservés.
          </div>
        </div>
      </footer>
    </main>
  );
}
