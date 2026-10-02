// src/components/QuestionsFilters.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface QuestionsFiltersProps {
  categories: Array<{ name: string; slug: string }>;
}

export default function QuestionsFilters({
  categories,
}: QuestionsFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategorie = searchParams.get("categorie") || "";
  const currentStatut = searchParams.get("statut") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/questions?${params.toString()}`);
  }

  const hasFilters = currentCategorie || currentStatut;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Catégorie :</label>
        <select
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={currentCategorie}
          onChange={(e) => updateFilter("categorie", e.target.value)}
        >
          <option value="">Toutes</option>
          {categories?.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Statut :</label>
        <select
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={currentStatut}
          onChange={(e) => updateFilter("statut", e.target.value)}
        >
          <option value="">Toutes</option>
          <option value="ouverte">Ouvertes</option>
          <option value="resolue">Résolues</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={() => router.push("/questions")}
          className="text-sm text-blue-600 hover:underline ml-auto"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
