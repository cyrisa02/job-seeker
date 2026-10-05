// src/utils/badges.ts

import { createClient } from "@/utils/supabase/server";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const BADGES: Badge[] = [
  {
    id: "contributor",
    name: "Contributeur",
    icon: "🥉",
    description: "1 contribution publiée",
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: "expert",
    name: "Expert",
    icon: "🥈",
    description: "5 contributions",
    color: "bg-gray-100 text-gray-800",
  },
  {
    id: "mentor",
    name: "Mentor",
    icon: "🥇",
    description: "10 contributions + 1 réponse approuvée",
    color: "bg-yellow-100 text-yellow-800",
  },
];

export async function getUserBadges(userId: string): Promise<Badge[]> {
  const supabase = await createClient();
  const earnedBadges: Badge[] = [];

  // Compter les articles publiés
  const { count: articlesCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "published");

  // Compter les questions publiées
  const { count: questionsCount } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "published");

  // Compter les réponses approuvées
  const { count: approvedAnswers } = await supabase
    .from("answers")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "approved");

  const totalContributions =
    (articlesCount || 0) + (questionsCount || 0) + (approvedAnswers || 0);

  // Badge Contributeur : au moins 1 contribution
  if (totalContributions >= 1) {
    earnedBadges.push(BADGES[0]);
  }

  // Badge Expert : au moins 5 contributions
  if (totalContributions >= 5) {
    earnedBadges.push(BADGES[1]);
  }

  // Badge Mentor : au moins 10 contributions + 1 réponse approuvée
  if (totalContributions >= 10 && (approvedAnswers || 0) >= 1) {
    earnedBadges.push(BADGES[2]);
  }

  return earnedBadges;
}

export async function getUserStats(userId: string) {
  const supabase = await createClient();

  const { count: articlesCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "published");

  const { count: questionsCount } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "published");

  const { count: approvedAnswers } = await supabase
    .from("answers")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "approved");

  return {
    articles: articlesCount || 0,
    questions: questionsCount || 0,
    answers: approvedAnswers || 0,
    total:
      (articlesCount || 0) + (questionsCount || 0) + (approvedAnswers || 0),
  };
}
