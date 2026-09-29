import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  publishArticle,
  archiveArticle,
  approveComment,
  rejectComment,
} from "./actions";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // 1. Articles en attente
  const { data: pendingArticles } = await supabase
    .from("articles")
    .select(
      `id, title, slug, content_md, status, created_at, profiles:author_id (username)`
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 2. Articles publiés
  const { data: publishedArticles } = await supabase
    .from("articles")
    .select(
      `id, title, slug, status, created_at, profiles:author_id (username)`
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 3. Commentaires en attente (requête corrigée)

  // 3. Commentaires en attente
  const { data: pendingComments, error } = await supabase
    .from("comments")
    .select(
      `
    id,
    content,
    created_at,
    article_id,
    articles (id, title, slug)
  `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  console.log("PENDING COMMENTS ERROR:", error);
  console.log("PENDING COMMENTS DATA:", pendingComments);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Retour au dashboard
          </Link>
        </div>

        {/* Articles en attente */}
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
                        Par {(article.profiles as any)?.username || "Anonyme"} •{" "}
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

        {/* Articles publiés */}
        <section className="mb-12">
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
                      Par {(article.profiles as any)?.username || "Anonyme"} •{" "}
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

        {/* Commentaires en attente */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Commentaires en attente ({pendingComments?.length || 0})
          </h2>
          {pendingComments && pendingComments.length > 0 ? (
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Sur l'article :{" "}
                        <Link
                          href={`/articles/${
                            (comment as any).articles?.slug || ""
                          }`}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          {(comment as any).articles?.title ||
                            "Article inconnu"}
                        </Link>
                      </p>
                      <p className="text-sm text-gray-500">
                        Par {(comment as any).profiles?.username || "Anonyme"} •{" "}
                        {new Date(comment.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={approveComment}>
                        <input
                          type="hidden"
                          name="commentId"
                          value={comment.id}
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Approuver
                        </button>
                      </form>
                      <form action={rejectComment}>
                        <input
                          type="hidden"
                          name="commentId"
                          value={comment.id}
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
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Aucun commentaire en attente de modération.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
