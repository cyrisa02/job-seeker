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

  const { data: articles } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, created_at,
      profiles:author_id (username)
    `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);

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

        <h2 className="text-2xl font-bold mb-6">Derniers articles</h2>

        {articles && articles.length > 0 ? (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Par {article.profiles?.username || "Anonyme"} •
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
          <p className="text-gray-500">Aucun article publié pour le moment.</p>
        )}
      </section>
    </main>
  );
}
