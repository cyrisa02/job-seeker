import { createClient } from "@/utils/supabase/server";

// Interface typée correspondant à notre table Supabase
interface Article {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

export default async function ArticleList() {
  const supabase = await createClient();

  // Récupération uniquement des articles publiés, triés par date décroissante
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, slug, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erreur de récupération des articles:", error);
    return (
      <p className="text-red-500">
        Impossible de charger les articles pour le moment.
      </p>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <p className="text-gray-500">Aucun article publié pour le moment.</p>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Dernières publications</h2>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="border-b pb-4">
            <a href={`/articles/${article.slug}`} className="group block">
              <h3 className="text-xl font-semibold text-blue-600 group-hover:underline">
                {article.title}
              </h3>
              <time className="text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
