import { createClient } from "@/utils/supabase/server";
import type { MetadataRoute } from "next";

export const revalidate = 3600; // Régénère toutes les heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Récupérer tous les articles publiés
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, created_at")
    .eq("status", "published");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const articlesEntries =
    articles?.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articlesEntries,
  ];
}
