// src/app/profils/[username]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BadgesDisplay from "@/components/BadgesDisplay";
import { getUserBadges, getUserStats } from "@/utils/badges";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Profil de ${username} | Plateforme Emploi 2026`,
    description: `Articles et contributions de ${username}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Récupérer le profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, bio, created_at")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Récupérer les articles
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, created_at")
    .eq("author_id", profile.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Récupérer les questions
  const { data: questions } = await supabase
    .from("questions")
    .select("id, title, slug, created_at, is_resolved")
    .eq("author_id", profile.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Récupérer les badges et stats
  const badges = await getUserBadges(profile.id);
  const stats = await getUserStats(profile.id);

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
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{username}</h1>
              {profile.bio && (
                <p className="text-gray-600 mb-4">{profile.bio}</p>
              )}
              <p className="text-sm text-gray-500">
                Membre depuis le{" "}
                {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Statistiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {stats.articles}
              </div>
              <div className="text-sm text-gray-600 mt-1">Articles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats.questions}
              </div>
              <div className="text-sm text-gray-600 mt-1">Questions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {stats.answers}
              </div>
              <div className="text-sm text-gray-600 mt-1">Réponses</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Badges</h2>
          <BadgesDisplay badges={badges} />
        </div>

        {/* Articles */}
        {articles && articles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Articles ({articles.length})
            </h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Questions */}
        {questions && questions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Questions ({questions.length})
            </h2>
            <div className="space-y-4">
              {questions.map((q) => (
                <Link
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {q.is_resolved && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        ✓ Résolue
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {q.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(q.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(!articles || articles.length === 0) &&
          (!questions || questions.length === 0) && (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              <p>Cet utilisateur n'a pas encore publié de contenu.</p>
            </div>
          )}
      </div>
    </main>
  );
}
