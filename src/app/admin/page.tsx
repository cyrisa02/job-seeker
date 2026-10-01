// src/app/admin/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  publishArticle,
  archiveArticle,
  approveComment,
  rejectComment,
  publishQuestion,
  rejectQuestion,
  approveAnswer,
  rejectAnswer,
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
      `id, title, slug, content_md, status, created_at, profiles:author_id (username)`,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 2. Articles publiés
  const { data: publishedArticles } = await supabase
    .from("articles")
    .select(
      `id, title, slug, status, created_at, profiles:author_id (username)`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 3. Commentaires en attente
  const { data: pendingComments } = await supabase
    .from("comments")
    .select(
      `id, content, created_at, article_id, articles!inner (id, title, slug), profiles:author_id (username)`,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 4. Questions en attente
  const { data: pendingQuestions } = await supabase
    .from("questions")
    .select(
      `id, title, content, slug, created_at, categories!left (name, slug), profiles:author_id (username)`,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 5. Réponses en attente ← NOUVEAU
  const { data: pendingAnswers } = await supabase
    .from("answers")
    .select(
      `
      id, content, created_at, question_id,
      questions!inner (id, title, slug),
      profiles:author_id (username)
    `,
    )
    .eq("status", "pending")
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
                        Par{" "}
                        <Link
                          href={`/profils/${(article.profiles as any)?.username || ""}`}
                          className="text-blue-600 hover:underline"
                        >
                          {(article.profiles as any)?.username || "Anonyme"}
                        </Link>{" "}
                        •{" "}
                        {new Date(article.created_at).toLocaleDateString(
                          "fr-FR",
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
                          href={`/articles/${(comment as any).articles?.slug || ""}`}
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
                          },
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

        {/* Questions en attente */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Questions en attente ({pendingQuestions?.length || 0})
          </h2>
          {pendingQuestions && pendingQuestions.length > 0 ? (
            <div className="space-y-4">
              {pendingQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {question.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Par {(question.profiles as any)?.username || "Anonyme"}{" "}
                        •{" "}
                        {new Date(question.created_at).toLocaleDateString(
                          "fr-FR",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </p>
                      {(question.categories as any)?.name && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mt-2">
                          {(question.categories as any).name}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <form action={publishQuestion}>
                        <input
                          type="hidden"
                          name="questionId"
                          value={question.id}
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Publier
                        </button>
                      </form>
                      <form action={rejectQuestion}>
                        <input
                          type="hidden"
                          name="questionId"
                          value={question.id}
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
                      {question.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Aucune question en attente de modération.
            </p>
          )}
        </section>

        {/* Réponses en attente ← NOUVELLE SECTION */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Réponses en attente ({pendingAnswers?.length || 0})
          </h2>
          {pendingAnswers && pendingAnswers.length > 0 ? (
            <div className="space-y-4">
              {pendingAnswers.map((answer) => (
                <div key={answer.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Sur la question :{" "}
                        <Link
                          href={`/questions/${(answer as any).questions?.slug || ""}`}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          {(answer as any).questions?.title ||
                            "Question inconnue"}
                        </Link>
                      </p>
                      <p className="text-sm text-gray-500">
                        Par {(answer as any).profiles?.username || "Anonyme"} •{" "}
                        {new Date(answer.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={approveAnswer}>
                        <input
                          type="hidden"
                          name="answerId"
                          value={answer.id}
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Approuver
                        </button>
                      </form>
                      <form action={rejectAnswer}>
                        <input
                          type="hidden"
                          name="answerId"
                          value={answer.id}
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
                      {answer.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Aucune réponse en attente de modération.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
