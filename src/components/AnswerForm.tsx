// src/components/AnswerForm.tsx

"use client";

import { useState } from "react";
import { submitAnswer } from "@/app/questions/[slug]/actions";

interface AnswerFormProps {
  questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError("");

    try {
      const result = await submitAnswer(formData);

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

  return (
    <form
      action={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-4"
    >
      <h3 className="text-lg font-bold">Votre réponse</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
          Réponse envoyée ! Elle sera publiée après modération.
        </div>
      )}

      <input type="hidden" name="questionId" value={questionId} />

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Partagez votre expérience ou vos conseils
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Soyez bienveillant et précis..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.length}/2000 caractères
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Envoi..." : "Publier ma réponse"}
      </button>
    </form>
  );
}
