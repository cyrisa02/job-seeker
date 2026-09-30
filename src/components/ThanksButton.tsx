"use client";

import { useState } from "react";
import { toggleThank } from "@/app/articles/[slug]/actions";

interface ThanksButtonProps {
  articleId: string;
  userId: string | null;
  initialCount: number;
  hasThanked: boolean;
}

export default function ThanksButton({
  articleId,
  userId,
  initialCount,
  hasThanked,
}: ThanksButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [thanked, setThanked] = useState(hasThanked);
  const [loading, setLoading] = useState(false);

  async function handleThank() {
    if (!userId) {
      alert("Connectez-vous pour remercier l'auteur");
      return;
    }

    setLoading(true);
    try {
      const result = await toggleThank(articleId);
      if (result?.success) {
        setThanked(result.thanked);
        setCount(result.count);
      }
    } catch (err) {
      console.error("Erreur Merci:", err);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleThank}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        thanked
          ? "bg-pink-100 text-pink-700 hover:bg-pink-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      <span className="text-xl">{thanked ? "💖" : "🤍"}</span>
      <span className="font-medium">{thanked ? "Merci !" : "Remercier"}</span>
      <span className="text-sm">({count})</span>
    </button>
  );
}
