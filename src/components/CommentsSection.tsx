import { createClient } from "@/utils/supabase/server";
import CommentForm from "./CommentForm";

interface CommentsSectionProps {
  articleId: string;
}

export default async function CommentsSection({
  articleId,
}: CommentsSectionProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      id, content, created_at, status,
      profiles:author_id (username)
    `
    )
    .eq("article_id", articleId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">
        Commentaires ({comments?.length || 0})
      </h2>

      {user ? (
        <CommentForm articleId={articleId} userId={user.id} />
      ) : (
        <p className="text-gray-600 mb-6">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Connectez-vous
          </a>{" "}
          pour laisser un commentaire.
        </p>
      )}

      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">
                  {(comment.profiles as any)?.username || "Anonyme"}
                </span>
                <time className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">
            Aucun commentaire pour le moment. Soyez le premier à réagir !
          </p>
        )}
      </div>
    </section>
  );
}
