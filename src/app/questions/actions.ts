// src/app/questions/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/utils/logger";

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté pour poser une question" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;

  logger.log("submitQuestion - title:", title);

  if (!title || title.trim().length < 5) {
    return { error: "Le titre doit contenir au moins 5 caractères" };
  }

  if (!content || content.trim().length < 20) {
    return { error: "La description doit contenir au moins 20 caractères" };
  }

  if (content.length > 2000) {
    return { error: "La description ne peut pas dépasser 2000 caractères" };
  }

  // Générer un slug à partir du titre
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);

  const { error } = await supabase.from("questions").insert({
    title: title.trim(),
    content: content.trim(),
    slug,
    category_id: categoryId || null,
    author_id: user.id,
    status: "pending",
    is_resolved: false,
  });

  if (error) {
    logger.error("Erreur submitQuestion:", error);
    return { error: "Erreur lors de la soumission de la question" };
  }

  revalidatePath("/questions");
  return { success: true };
}
