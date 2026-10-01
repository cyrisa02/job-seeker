// src/app/categories/[slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { logger } from "@/utils/logger"; // ← AJOUT

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "Catégorie non trouvée" };

  return {
    title: `${category.name} | Plateforme Emploi 2026`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  logger.log("CategoryPage - slug:", slug); // Debug

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    logger.log("CategoryPage - category not found");
    notFound();
  }

  const { data: articles } = await supabase
    .from("articles")
    .select(`id, title, slug, created_at, profiles:author_id (username)`)
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  logger.log("CategoryPage - articles:", articles?.length); // Debug

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour à l'accueil
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-600 text-lg">{category.description}</p>
        </header>

        {articles && articles.length > 0 ? (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-2">
                  {article.title}
                </h2>
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
          <p className="text-gray-500">
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </main>
  );
}
