// src/app/auth/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string; // ← NOUVEAU

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // En cas d'erreur, on renvoie vers le login avec le paramètre error
    redirect(
      `/auth/login?error=${error.message}&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  // Succès : redirection vers l'URL demandée (ou /dashboard par défaut)
  redirect(redirectTo || "/dashboard");
}
// ✅ AJOUTE CETTE FONCTION
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
