// src/app/profils/[username]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Profil de ${username} | Plateforme Emploi 2026`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  console.log("ProfilePage - fetching profile for username:", username);

  // 1. Récupérer le profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, bio, created_at")
    .eq("username", username)
    .single();

  if (!profile) {
    console.log("ProfilePage - profile not found");
    notFound();
  }

  // 2. Récupérer les articles publiés par cet utilisateur
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, created_at")
    .eq("author_id", profile.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  console.log("ProfilePage - found articles:", articles?.length);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour à l'accueil
        </Link>

        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-gray-500 text-sm">
                Membre depuis{" "}
                {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-6 pt-6 border-t">
              <h2 className="text-lg font-semibold mb-2">À propos</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Liste des articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Articles publiés ({articles?.length || 0})
          </h2>
          {articles && articles.length > 0 ? (
            <div className="grid gap-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Publié le{" "}
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
            <p className="text-gray-500">
              Cet utilisateur n'a pas encore publié d'articles.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
