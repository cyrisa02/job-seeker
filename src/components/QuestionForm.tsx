// src/components/QuestionForm.tsx

"use client";

import { useState } from "react";
import { submitQuestion } from "@/app/questions/actions";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface QuestionFormProps {
  userId: string;
  categories: Category[];
}

export default function QuestionForm({
  userId,
  categories,
}: QuestionFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError("");

    try {
      const result = await submitQuestion(formData);

      if (result?.error) {
        setError(result.error);
        setStatus("error");
      } else {
        setTitle("");
        setContent("");
        setCategoryId("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 5000);
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
          Question soumise ! Elle sera publiée après modération.
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Titre de votre question
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ex: Comment négocier une rupture conventionnelle ?"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Catégorie
        </label>
        <select
          id="category"
          name="categoryId"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Détails (contexte, situation personnelle...)
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Décrivez votre situation en détail pour que la communauté puisse vous aider..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.length} caractères
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Envoi en cours..." : "Poser ma question"}
      </button>
    </form>
  );
}
