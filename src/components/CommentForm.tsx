"use client";

import { useState, useEffect } from "react";
import { submitComment } from "@/app/articles/[slug]/actions";

interface CommentFormProps {
  articleId: string;
  userId: string;
}

export default function CommentForm({ articleId, userId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Évite l'erreur d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError("");

    try {
      const result = await submitComment(formData);

      if (result?.error) {
        setError(result.error);
        setStatus("error");
      } else {
        setContent("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setStatus("error");
    }
  }

  // Ne pas rendre le formulaire tant que le client n'est pas monté
  if (!mounted) {
    return null;
  }

  return (
    <form action={handleSubmit} className="mb-8">
      <input type="hidden" name="articleId" value={articleId} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm mb-4">
          Commentaire soumis ! Il sera visible après modération.
        </div>
      )}

      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        minLength={10}
        maxLength={1000}
        rows={4}
        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none mb-2"
        placeholder="Votre commentaire (minimum 10 caractères)..."
      />

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {content.length}/1000 caractères
        </span>
        <button
          type="submit"
          disabled={status === "submitting" || content.length < 10}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Envoi..." : "Commenter"}
        </button>
      </div>
    </form>
  );
}
