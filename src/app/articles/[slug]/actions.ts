// src/app/articles/[slug]/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté" };
  }

  const content = formData.get("content") as string;
  const articleId = formData.get("articleId") as string;

  logger.log("submitComment - articleId:", articleId);
  logger.log("submitComment - content:", content);

  if (!content || content.trim().length < 10) {
    return { error: "Le commentaire doit contenir au moins 10 caractères" };
  }

  if (content.length > 1000) {
    return { error: "Le commentaire ne peut pas dépasser 1000 caractères" };
  }

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id, status")
    .eq("id", articleId)
    .single();

  logger.log("submitComment - article:", article);
  logger.log("submitComment - articleError:", articleError);

  if (!article) {
    return { error: "Article introuvable" };
  }

  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", oneHourAgo);

  if (count && count >= 5) {
    return { error: "Trop de commentaires. Réessayez dans une heure." };
  }

  const { error } = await supabase.from("comments").insert({
    article_id: articleId,
    author_id: user.id,
    content: content.trim(),
    status: "pending",
  });

  if (error) {
    console.error("Erreur commentaire:", error);
    return { error: "Erreur lors de la soumission" };
  }

  revalidatePath(`/articles/${articleId}`);
  return { success: true };
}

// ← NOUVELLE FONCTION À AJOUTER
export async function toggleThank(articleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté" };
  }

  logger.log("toggleThank - articleId:", articleId, "userId:", user.id);

  // Vérifier si l'utilisateur a déjà remercié
  const { data: existingThank } = await supabase
    .from("thanks")
    .select("id")
    .eq("article_id", articleId)
    .eq("user_id", user.id)
    .single();

  let thanked: boolean;
  let count: number;

  if (existingThank) {
    // Retirer le Merci
    const { error } = await supabase
      .from("thanks")
      .delete()
      .eq("id", existingThank.id);

    logger.log("toggleThank - removed, error:", error);
    thanked = false;
  } else {
    // Ajouter le Merci
    const { error } = await supabase
      .from("thanks")
      .insert({ article_id: articleId, user_id: user.id });

    logger.log("toggleThank - added, error:", error);
    thanked = true;
  }

  // Compter les Merci
  const { count: thankCount } = await supabase
    .from("thanks")
    .select("*", { count: "exact", head: true })
    .eq("article_id", articleId);

  count = thankCount || 0;

  logger.log("toggleThank - thanked:", thanked, "count:", count);

  revalidatePath(`/articles/${articleId}`);
  return { success: true, thanked, count };
}
