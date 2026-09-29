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
    .select("title, content_md, created_at, profiles:author_id(username)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return { title: "Article non trouvé" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
    article.title
  )}&author=${encodeURIComponent(article.profiles?.username || "Anonyme")}`;

  return {
    title: article.title,
    description: article.content_md.substring(0, 160).replace(/\n/g, " "),
    openGraph: {
      title: article.title,
      description: article.content_md.substring(0, 160).replace(/\n/g, " "),
      type: "article",
      publishedTime: article.created_at,
      authors: [article.profiles?.username || "Anonyme"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content_md.substring(0, 160).replace(/\n/g, " "),
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // ← CORRECTION 2

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: {
      "@type": "Person",
      name: article.profiles?.username || "Anonyme",
    },
    datePublished: article.created_at,
    publisher: {
      "@type": "Organization",
      name: "Plateforme Emploi 2026",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${slug}`, // ← Utilise baseUrl
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: baseUrl, // ← Utilise baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.title,
        item: `${baseUrl}/articles/${slug}`, // ← Utilise baseUrl
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:underline">
            Accueil
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

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
