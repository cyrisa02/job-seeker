// src/app/questions/[slug]/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/utils/logger";

export async function submitAnswer(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour répondre" };
  }

  const questionId = formData.get("questionId") as string;
  const content = formData.get("content") as string;

  logger.log("submitAnswer - questionId:", questionId);

  if (!questionId) {
    return { error: "Question introuvable" };
  }

  if (!content || content.trim().length < 10) {
    return { error: "La réponse doit contenir au moins 10 caractères" };
  }

  if (content.length > 2000) {
    return { error: "La réponse ne peut pas dépasser 2000 caractères" };
  }

  const { error } = await supabase.from("answers").insert({
    question_id: questionId,
    author_id: user.id,
    content: content.trim(),
    status: "pending", // Nécessite une modération
  });

  if (error) {
    logger.error("Erreur submitAnswer:", error);
    return { error: "Erreur lors de la soumission de la réponse" };
  }

  revalidatePath(`/questions/${questionId}`);
  return { success: true };
}
export async function toggleResolved(questionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  // Vérifier que l'utilisateur est bien l'auteur
  const { data: question } = await supabase
    .from("questions")
    .select("author_id, is_resolved")
    .eq("id", questionId)
    .single();

  if (!question || question.author_id !== user.id) {
    return { error: "Vous n'êtes pas l'auteur de cette question" };
  }

  const { error } = await supabase
    .from("questions")
    .update({ is_resolved: !question.is_resolved })
    .eq("id", questionId);

  if (error) return { error: "Erreur lors de la mise à jour" };

  revalidatePath(`/questions/${questionId}`);
  return { success: true, isResolved: !question.is_resolved };
}
