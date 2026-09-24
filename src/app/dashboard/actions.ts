"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitArticle(formData: FormData) {
  const supabase = await createClient();

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour soumettre un article" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Validation basique
  if (!title || title.trim().length < 10) {
    return { error: "Le titre doit contenir au moins 10 caractères" };
  }

  if (!content || content.trim().length < 100) {
    return { error: "Le contenu doit contenir au moins 100 caractères" };
  }

  // Générer un slug à partir du titre
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Insérer l'article avec le statut 'pending' (en attente de modération)
  const { error } = await supabase.from("articles").insert({
    title: title.trim(),
    content_md: content.trim(),
    slug: `${slug}-${Date.now()}`, // Ajouter timestamp pour éviter les doublons
    author_id: user.id,
    status: "pending",
  });

  if (error) {
    console.error("Erreur lors de la soumission:", error);
    return { error: "Erreur lors de la soumission de l'article" };
  }

  // Revalider le cache pour afficher le nouvel article dans la liste
  revalidatePath("/dashboard");

  return { success: true };
}
