"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Fonction pour générer un slug propre
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80); // Limiter la longueur
}

export async function submitArticle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour soumettre un article" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim().length < 10) {
    return { error: "Le titre doit contenir au moins 10 caractères" };
  }

  if (!content || content.trim().length < 100) {
    return { error: "Le contenu doit contenir au moins 100 caractères" };
  }

  // Générer un slug de base
  let slug = generateSlug(title);

  // Vérifier l'unicité et ajouter un suffixe si nécessaire
  const { data: existingArticle } = await supabase
    .from("articles")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existingArticle) {
    // Ajouter un timestamp uniquement si le slug existe déjà
    slug = `${slug}-${Date.now()}`;
  }

  const { error } = await supabase.from("articles").insert({
    title: title.trim(),
    content_md: content.trim(),
    slug: slug,
    author_id: user.id,
    status: "pending",
  });

  if (error) {
    console.error("Erreur lors de la soumission:", error);
    return { error: "Erreur lors de la soumission de l'article" };
  }

  revalidatePath("/dashboard");

  return { success: true };
}
