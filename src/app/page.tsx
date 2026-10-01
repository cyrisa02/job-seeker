// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plateforme Emploi 2026 - Aide aux demandeurs d'emploi",
  description:
    "Guides, astuces et témoignages pour les demandeurs d'emploi en France",
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Récupérer les catégories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  console.log("Home - categories:", categories); // Debug

  // Récupérer les articles avec leur catégorie
  const { data: articles } = await supabase
    .from("articles")
    .select(
      `id, title, slug, created_at, category_id, categories!inner (name, slug), profiles:author_id (username)`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);

  console.log("Home - articles:", articles?.length); // Debug

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Plateforme Emploi 2026</h1>
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
          <p className="text-blue-100">
            Guides, astuces et témoignages pour les demandeurs d'emploi en
            France
          </p>
        </div>

        {/* Section Catégories */}
        {categories && categories.length > 0 && (
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

        <h2 className="text-2xl font-bold mb-6">Derniers articles</h2>
        {articles && articles.length > 0 ? (
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
                <div className="flex items-center gap-2 mb-2">
                  {(article.categories as any)?.slug && (
                    <Link
                      href={`/categories/${(article.categories as any).slug}`}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-200"
                    >
                      {(article.categories as any).name}
                    </Link>
                  )}
                </div>
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
        ) : (
          <p className="text-gray-500">Aucun article publié pour le moment.</p>
        )}
      </section>
    </main>
  );
}
