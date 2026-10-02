// src/app/stats/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistiques | Plateforme Emploi 2026",
  description: "Découvrez les chiffres de notre communauté d'entraide",
};

export default async function StatsPage() {
  const supabase = await createClient();

  const { count: articlesCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: questionsCount } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: resolvedCount } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("is_resolved", true);

  const { count: membersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: answersCount } = await supabase
    .from("answers")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  // Top contributeurs - version corrigée
  const { data: topArticles } = await supabase
    .from("articles")
    .select("author_id, profiles:author_id (username)")
    .eq("status", "published");

  const grouped = (topArticles || []).reduce((acc: any, article: any) => {
    const username = article.profiles?.username || "Anonyme";
    acc[username] = (acc[username] || 0) + 1;
    return acc;
  }, {});

  const topContributors = Object.entries(grouped)
    .map(([username, count]) => ({ username, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold mb-2">
          Statistiques de la communauté
        </h1>
        <p className="text-gray-600 mb-12">
          Ensemble, nous construisons une plateforme d'entraide pour les
          demandeurs d'emploi.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {articlesCount || 0}
            </div>
            <div className="text-gray-600">Articles publiés</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {questionsCount || 0}
            </div>
            <div className="text-gray-600">Questions posées</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {resolvedCount || 0}
            </div>
            <div className="text-gray-600">Questions résolues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {answersCount || 0}
            </div>
            <div className="text-gray-600">Réponses données</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {membersCount || 0}
            </div>
            <div className="text-gray-600">Membres inscrits</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">
              {questionsCount && questionsCount > 0
                ? Math.round(((resolvedCount || 0) / questionsCount) * 100)
                : 0}
              %
            </div>
            <div className="text-gray-600">Taux de résolution</div>
          </div>
        </div>

        {topContributors.length > 0 && (
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Top contributeurs</h2>
            <div className="space-y-4">
              {topContributors.map((contributor, index: number) => (
                <div
                  key={contributor.username}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-orange-600"
                              : "bg-blue-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <Link
                      href={`/profils/${contributor.username}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {contributor.username}
                    </Link>
                  </div>
                  <div className="text-gray-600">
                    {contributor.count} article
                    {contributor.count > 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
