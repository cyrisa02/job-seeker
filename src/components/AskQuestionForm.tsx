// src/components/AskQuestionForm.tsx

"use client";

import { useState } from "react";
import { submitQuestion } from "@/app/questions/actions";
import { useRouter } from "next/navigation";

interface AskQuestionFormProps {
  userId: string;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function AskQuestionForm({
  userId,
  categories,
}: AskQuestionFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  // État de la checklist
  const [checklist, setChecklist] = useState({
    titleClear: false,
    context: false,
    singleQuestion: false,
    triedAlready: false,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  function toggleCheck(key: keyof typeof checklist) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);

    const result = await submitQuestion(formData);

    if (result?.error) {
      setError(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => {
        router.push("/questions");
      }, 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Question envoyée ! Elle sera publiée après modération.
          Redirection...
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Titre de votre question
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Comment négocier une rupture conventionnelle ?"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Catégorie
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description détaillée
        </label>
        <textarea
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Décrivez votre situation, votre question précise, le contexte..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.length}/2000 caractères
        </p>
      </div>

      {/* Checklist avant soumission */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
          ✅ Checklist avant de publier
        </h3>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checklist.titleClear}
              onChange={() => toggleCheck("titleClear")}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label className="text-sm text-blue-800 cursor-pointer select-none">
              Mon titre décrit clairement ma question
            </label>
          </li>
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checklist.context}
              onChange={() => toggleCheck("context")}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label className="text-sm text-blue-800 cursor-pointer select-none">
              J'ai donné le contexte (statut, ancienneté, secteur)
            </label>
          </li>
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checklist.singleQuestion}
              onChange={() => toggleCheck("singleQuestion")}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label className="text-sm text-blue-800 cursor-pointer select-none">
              Je pose UNE seule question
            </label>
          </li>
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checklist.triedAlready}
              onChange={() => toggleCheck("triedAlready")}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label className="text-sm text-blue-800 cursor-pointer select-none">
              J'ai précisé ce que j'ai déjà essayé
            </label>
          </li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || !allChecked}
        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={!allChecked ? "Cochez toutes les cases pour soumettre" : ""}
      >
        {status === "submitting"
          ? "Envoi en cours..."
          : "Soumettre ma question"}
      </button>

      {!allChecked && (
        <p className="text-xs text-gray-500 text-center">
          Cochez toutes les cases pour activer le bouton de soumission.
        </p>
      )}
    </form>
  );
}
