"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function publishArticle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Vérifier le rôle
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return { error: "Accès refusé" };
  }

  const articleId = formData.get("articleId") as string;

  const { error } = await supabase
    .from("articles")
    .update({ status: "published" })
    .eq("id", articleId);

  if (error) {
    console.error("Erreur publication:", error);
    return { error: "Erreur lors de la publication" };
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function archiveArticle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return { error: "Accès refusé" };
  }

  const articleId = formData.get("articleId") as string;

  const { error } = await supabase
    .from("articles")
    .update({ status: "archived" })
    .eq("id", articleId);

  if (error) {
    console.error("Erreur archivage:", error);
    return { error: "Erreur lors de l'archivage" };
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
