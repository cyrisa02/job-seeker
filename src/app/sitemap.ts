// src/app/sitemap.ts

import { createClient } from "@/utils/supabase/server";
import type { MetadataRoute } from "next";

export const revalidate = 3600; // Revalide toutes les heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/questions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Articles publiés
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const articlesUrls: MetadataRoute.Sitemap = (articles || []).map(
    (article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  // Questions publiées
  const { data: questions } = await supabase
    .from("questions")
    .select("slug, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const questionsUrls: MetadataRoute.Sitemap = (questions || []).map(
    (question) => ({
      url: `${baseUrl}/questions/${question.slug}`,
      lastModified: new Date(question.created_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  // Catégories
  const { data: categories } = await supabase.from("categories").select("slug");

  const categoriesUrls: MetadataRoute.Sitemap = (categories || []).map(
    (cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  return [...staticPages, ...articlesUrls, ...questionsUrls, ...categoriesUrls];
}
