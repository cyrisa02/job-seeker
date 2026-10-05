// src/app/articles/[slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Metadata } from "next";
import ThanksButton from "@/components/ThanksButton";
import ShareButtons from "@/components/ShareButtons";
import BadgesDisplay from "@/components/BadgesDisplay";
import { getUserBadges } from "@/utils/badges";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // src/app/articles/[slug]/page.tsx

  // Ligne ~45, remplace la requête par :
  const { data: article } = await supabase
    .from("articles")
    .select(
      `
  id, title, content_md, created_at, category_id, author_id,
  profiles:author_id (id, username)
`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return { title: "Article non trouvé" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const authorName = (article.profiles as any)?.username || "Anonyme";
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&author=${encodeURIComponent(authorName)}`;

  return {
    title: article.title,
    description: article.content_md.substring(0, 160).replace(/\n/g, " "),
    openGraph: {
      title: article.title,
      description: article.content_md.substring(0, 160).replace(/\n/g, " "),
      type: "article",
      publishedTime: article.created_at,
      authors: [authorName],
      images: [
        { url: ogImageUrl, width: 1200, height: 630, alt: article.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content_md.substring(0, 160).replace(/\n/g, " "),
      images: [ogImageUrl],
    },
    alternates: { canonical: `${baseUrl}/articles/${slug}` },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 1. Récupérer l'article (avec category_id pour les articles similaires)
  const { data: article } = await supabase
    .from("articles")
    .select(
      "id, title, content_md, created_at, category_id, profiles:author_id (username)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();

  const authorName = (article.profiles as any)?.username || "Anonyme";

  // Après avoir récupéré l'article, ajoute :
  const authorBadges = await getUserBadges((article as any).author_id);

  // Dans le JSX, après le nom de l'auteur :
  <div className="flex items-center gap-2 flex-wrap">
    <Link
      href={`/profils/${authorName}`}
      className="font-semibold text-blue-600 hover:underline"
    >
      {authorName}
    </Link>
    {authorBadges.length > 0 && <BadgesDisplay badges={authorBadges} compact />}
  </div>;

  // 2. Récupérer les Merci
  const { data: thanks } = await supabase
    .from("thanks")
    .select("user_id")
    .eq("article_id", article.id);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hasThanked = thanks?.some((t) => t.user_id === user?.id) || false;
  const thankCount = thanks?.length || 0;

  // 3. Récupérer les articles similaires (même catégorie, exclu l'article actuel)
  let relatedArticles: any[] = [];
  if (article.category_id) {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, created_at, profiles:author_id (username)")
      .eq("status", "published")
      .eq("category_id", article.category_id)
      .neq("id", article.id)
      .limit(3);
    relatedArticles = data || [];
  }

  // Schemas JSON-LD (inchangés)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: { "@type": "Person", name: authorName },
    datePublished: article.created_at,
    publisher: { "@type": "Organization", name: "Plateforme Emploi 2026" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${slug}`,
    },
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
            <Link
              href={`/profils/${authorName}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {authorName}
            </Link>
            {" • "}
            {new Date(article.created_at).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <div className="flex items-center gap-4 mb-8">
          <ThanksButton
            articleId={article.id}
            userId={user?.id || null}
            initialCount={thankCount}
            hasThanked={hasThanked}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content_md}
          </ReactMarkdown>
        </div>

        {/* Boutons de partage */}
        <ShareButtons
          url={`${baseUrl}/articles/${slug}`}
          title={article.title}
        />

        {/* Articles similaires */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
            <div className="grid gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-blue-600 mb-1">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {(related.profiles as any)?.username || "Anonyme"} •{" "}
                    {new Date(related.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
