import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("title, content_md")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return { title: "Article non trouvé" };

  return {
    title: article.title,
    description: article.content_md.substring(0, 160),
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select(
      `
      id, title, content_md, created_at,
      profiles:author_id (username)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour aux articles
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="text-gray-600">
            Par{" "}
            <span className="font-semibold">
              {article.profiles?.username || "Anonyme"}
            </span>{" "}
            •
            {new Date(article.created_at).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content_md}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
