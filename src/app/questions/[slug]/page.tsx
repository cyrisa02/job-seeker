// src/app/questions/[slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import AnswerForm from "@/components/AnswerForm";
import type { Metadata } from "next";

interface QuestionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: question } = await supabase
    .from("questions")
    .select("title, content")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!question) return { title: "Question non trouvée" };

  return {
    title: `${question.title} | Plateforme Emploi 2026`,
    description: question.content.substring(0, 160),
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("QuestionPage - slug:", slug);

  // 1. Récupérer la question
  const { data: question } = await supabase
    .from("questions")
    .select(
      `
    id, title, content, slug, is_resolved, created_at, author_id,
    categories!left (name, slug),
    profiles:author_id (id, username)
  `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!question) {
    console.log("QuestionPage - not found");
    notFound();
  }

  // 2. Récupérer les réponses approuvées
  const { data: answers } = await supabase
    .from("answers")
    .select(
      `
      id, content, created_at,
      profiles:author_id (username)
    `,
    )
    .eq("question_id", question.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  console.log("QuestionPage - answers:", answers?.length);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/questions"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour aux questions
        </Link>

        {/* Bouton Marquer comme résolue */}
        {user?.id === question.author_id && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {question.is_resolved
                ? "Cette question est résolue"
                : "Votre question a-t-elle trouvé sa réponse ?"}
            </span>
            <form
              action={async () => {
                "use server";
                const { toggleResolved } = await import("./actions");
                await toggleResolved(question.id);
              }}
            >
              <button
                type="submit"
                className={`px-4 py-2 rounded text-sm font-medium ${
                  question.is_resolved
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {question.is_resolved
                  ? "Rouvrir la question"
                  : "✓ Marquer comme résolue"}
              </button>
            </form>
          </div>
        )}

        {/* Question */}
        <article className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            {question.is_resolved && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                ✓ Résolue
              </span>
            )}
            {(question.categories as any)?.slug && (
              <Link
                href={`/categories/${(question.categories as any).slug}`}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-200"
              >
                {(question.categories as any).name}
              </Link>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {question.content}
            </p>
          </div>

          <div className="text-sm text-gray-500 border-t pt-4">
            Posée par{" "}
            <Link
              href={`/profils/${(question.profiles as any)?.username || ""}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {(question.profiles as any)?.username || "Anonyme"}
            </Link>{" "}
            le{" "}
            {new Date(question.created_at).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </article>

        {/* Réponses */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Réponses ({answers?.length || 0})
          </h2>

          {answers && answers.length > 0 ? (
            <div className="space-y-4">
              {answers.map((answer) => (
                <div key={answer.id} className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">
                    {answer.content}
                  </p>
                  <div className="text-sm text-gray-500">
                    Réponse de{" "}
                    <Link
                      href={`/profils/${(answer.profiles as any)?.username || ""}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {(answer.profiles as any)?.username || "Anonyme"}
                    </Link>{" "}
                    • {new Date(answer.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Aucune réponse pour le moment. Soyez le premier à répondre !
            </div>
          )}
        </section>

        {/* Formulaire de réponse */}
        {user ? (
          <AnswerForm questionId={question.id} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-2">
              Connectez-vous pour partager votre expérience.
            </p>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
