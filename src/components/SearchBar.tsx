// src/components/SearchBar.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un article, une question..."
        className="flex-1 border border-white/30 bg-white/10 text-white placeholder:text-white/70 rounded-lg px-4 py-3 focus:ring-2 focus:ring-white/50 outline-none"
      />
      <button
        type="submit"
        className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
      >
        Rechercher
      </button>
    </form>
  );
}
