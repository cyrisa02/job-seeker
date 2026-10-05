// src/components/AnswerLikeButton.tsx

"use client";

import { useState } from "react";
import { toggleAnswerLike } from "@/app/questions/[slug]/actions";

interface AnswerLikeButtonProps {
  answerId: string;
  userId: string | null;
  initialCount: number;
  hasLiked: boolean;
}

export default function AnswerLikeButton({
  answerId,
  userId,
  initialCount,
  hasLiked: initialHasLiked,
}: AnswerLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await toggleAnswerLike(answerId);
      if (result.success) {
        setHasLiked(result.hasLiked);
        setCount(result.count);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={!userId || loading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        hasLiked
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${!userId ? "opacity-50 cursor-not-allowed" : ""}`}
      title={
        userId
          ? hasLiked
            ? "Retirer le j'aime"
            : "J'aime cette réponse"
          : "Connectez-vous pour liker"
      }
    >
      <span>{hasLiked ? "👍" : "👍🏻"}</span>
      <span>{count}</span>
    </button>
  );
}
