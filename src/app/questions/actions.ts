// src/app/questions/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;

  logger.log("submitQuestion - title:", title);
  logger.log("submitQuestion - categoryId:", categoryId);

  if (!title || title.trim().length < 10) {
    return { error: "Le titre doit contenir au moins 10 caractères" };
  }
  if (!content || content.trim().length < 30) {
    return { error: "Le contenu doit contenir au moins 30 caractères" };
  }
  if (!categoryId) {
    return { error: "Veuillez choisir une catégorie" };
  }

  let slug = generateSlug(title);

  const { data: existing } = await supabase
    .from("questions")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const { error } = await supabase.from("questions").insert({
    title: title.trim(),
    content: content.trim(),
    slug,
    category_id: categoryId,
    author_id: user.id,
    status: "pending",
  });

  if (error) {
    console.error("Erreur submitQuestion:", error);
    return { error: "Erreur lors de la soumission" };
  }

  revalidatePath("/questions");
  revalidatePath("/admin");
  return { success: true };
}
