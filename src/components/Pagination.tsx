// src/components/Pagination.tsx

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Construit l'URL en conservant les filtres existants
  function buildUrl(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${basePath}?${params.toString()}`;
  }

  // Génère les numéros de pages à afficher (avec ... pour les grandes plages)
  function getPages(): (number | "...")[] {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      aria-label="Pagination"
    >
      {/* Bouton Précédent */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
        >
          ← Précédent
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed">
          ← Précédent
        </span>
      )}

      {/* Numéros de pages */}
      <div className="flex gap-1">
        {getPages().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-blue-600 text-white font-medium"
                  : "border border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {/* Bouton Suivant */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
        >
          Suivant →
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed">
          Suivant →
        </span>
      )}
    </nav>
  );
}
