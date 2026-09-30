// src/app/dashboard/profil/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfil(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté" };
  }

  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;

  console.log("updateProfil - userId:", user.id);
  console.log("updateProfil - username:", username);
  console.log("updateProfil - bio:", bio);

  if (!username || username.trim().length < 3) {
    return {
      error: "Le nom d'utilisateur doit contenir au moins 3 caractères",
    };
  }

  if (bio && bio.length > 500) {
    return { error: "La bio ne peut pas dépasser 500 caractères" };
  }

  // Vérifier l'unicité du username (sauf si c'est le même)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.trim())
    .neq("id", user.id)
    .single();

  if (existingProfile) {
    return { error: "Ce nom d'utilisateur est déjà pris" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: username.trim(),
      bio: bio?.trim() || null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Erreur updateProfil:", error);
    return { error: "Erreur lors de la mise à jour" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profil");
  return { success: true };
}
