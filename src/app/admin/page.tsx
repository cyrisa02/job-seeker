import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { publishArticle, archiveArticle } from "./actions";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Accès refusé. Rôle admin requis.</p>
      </div>
    );
  }

  const { data: pendingArticles } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, content_md, status, created_at,
      profiles:author_id (username)
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: publishedArticles } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, status, created_at,
      profiles:author_id (username)
    `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Retour au dashboard
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Articles en attente ({pendingArticles?.length || 0})
          </h2>
          {pendingArticles && pendingArticles.length > 0 ? (
            <div className="space-y-4">
              {pendingArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        Par {article.profiles?.username || "Anonyme"} •
                        {new Date(article.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={publishArticle}>
                        <input
                          type="hidden"
                          name="articleId"
                          value={article.id}
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Publier
                        </button>
                      </form>
                      <form action={archiveArticle}>
                        <input
                          type="hidden"
                          name="articleId"
                          value={article.id}
                        />
                        <button
                          type="submit"
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Rejeter
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded max-h-48 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {article.content_md}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Aucun article en attente de modération.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Articles publiés ({publishedArticles?.length || 0})
          </h2>
          {publishedArticles && publishedArticles.length > 0 ? (
            <ul className="space-y-2">
              {publishedArticles.map((article) => (
                <li
                  key={article.id}
                  className="bg-white rounded shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Par {article.profiles?.username || "Anonyme"} •
                      {new Date(article.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <form action={archiveArticle}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline text-sm"
                    >
                      Archiver
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun article publié.</p>
          )}
        </section>
      </div>
    </div>
  );
}
