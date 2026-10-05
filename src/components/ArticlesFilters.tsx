// src/components/ArticlesFilters.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface ArticlesFiltersProps {
  categories: Array<{ name: string; slug: string }>;
  currentCategorie: string;
  currentTri: string;
}

export default function ArticlesFilters({
  categories,
  currentCategorie,
  currentTri,
}: ArticlesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset pagination quand on change un filtre
    router.push(`/articles?${params.toString()}`);
  }

  const hasFilters = currentCategorie || currentTri;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Catégorie :</label>
        <select
          value={currentCategorie}
          onChange={(e) => updateFilter("categorie", e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Toutes</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Trier par :</label>
        <select
          value={currentTri}
          onChange={(e) => updateFilter("tri", e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Plus récents</option>
          <option value="ancien">Plus anciens</option>
          <option value="titre">Titre (A-Z)</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={() => router.push("/articles")}
          className="text-sm text-blue-600 hover:underline ml-auto"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
