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

  console.log("submitComment - articleId:", articleId);
  console.log("submitComment - content:", content);

  if (!content || content.trim().length < 10) {
    return { error: "Le commentaire doit contenir au moins 10 caractères" };
  }

  if (content.length > 1000) {
    return { error: "Le commentaire ne peut pas dépasser 1000 caractères" };
  }

  // Vérifier que l'article existe (sans filtre de statut)
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id, status")
    .eq("id", articleId)
    .single();

  console.log("submitComment - article:", article);
  console.log("submitComment - articleError:", articleError);

  if (!article) {
    return { error: "Article introuvable" };
  }

  // Rate limiting : max 5 commentaires par heure
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", oneHourAgo);

  if (count && count >= 5) {
    return { error: "Trop de commentaires. Réessayez dans une heure." };
  }

  // Insertion
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
