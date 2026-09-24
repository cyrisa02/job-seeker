"use client";

import { useState } from "react";
import { submitArticle } from "@/app/dashboard/actions";

interface ArticleFormProps {
  userId: string;
}

export default function ArticleForm({ userId }: ArticleFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError("");

    try {
      const result = await submitArticle(formData);

      if (result?.error) {
        setError(result.error);
        setStatus("error");
      } else {
        setTitle("");
        setContent("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setStatus("error");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
          Article soumis avec succès ! Il sera publié après modération.
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Titre de l'article
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ex: Comment j'ai retrouvé un emploi en 3 mois"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Contenu (Markdown supporté)
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
          placeholder="Rédigez votre article ici... Vous pouvez utiliser la syntaxe Markdown."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Envoi en cours..." : "Soumettre l'article"}
      </button>
    </form>
  );
}
