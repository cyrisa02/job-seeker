// src/app/dashboard/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import Navbar from "@/components/NavBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Allié Emploi",
  description:
    "Gérez vos articles, questions et contributions sur Allié Emploi.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .single();

  // Récupérer les catégories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  // Récupérer les articles soumis par l'utilisateur
  const { data: myArticles } = await supabase
    .from("articles")
    .select("id, title, slug, status, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar user={user} currentPage="dashboard" />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* En-tête utilisateur */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Connecté en tant que{" "}
                  <span className="font-semibold break-all">{user.email}</span>
                  {profile?.role && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm">
                      {profile.role}
                    </span>
                  )}
                </p>
              </div>

              {/* Liens utilisateur (mobile-friendly) */}
              <div className="flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/profils/${profile?.username}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Voir mon profil public
                </Link>
                {profile?.role === "admin" || profile?.role === "moderator" ? (
                  <Link
                    href="/admin"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Administration
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {/* Formulaire de soumission */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Soumettre un article
            </h2>
            <ArticleForm userId={user.id} categories={categories || []} />
          </div>

          {/* Liste des articles soumis */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Mes articles soumis ({myArticles?.length || 0})
            </h2>
            {myArticles && myArticles.length > 0 ? (
              <ul className="space-y-3">
                {myArticles.map((article) => (
                  <li
                    key={article.id}
                    className="border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="font-semibold text-blue-600 hover:underline block truncate"
                        >
                          {article.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {new Date(article.created_at).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${
                          article.status === "published"
                            ? "bg-green-100 text-green-800"
                            : article.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {article.status === "published"
                          ? "Publié"
                          : article.status === "pending"
                            ? "En attente"
                            : "Archivé"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Vous n'avez pas encore soumis d'articles.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-500">
            © 2026 Allié Emploi. Fait avec 💙 pour les demandeurs d'emploi.
          </div>
        </footer>
      </main>
    </>
  );
}
