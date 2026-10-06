// src/app/auth/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logger } from "@/utils/logger";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/dashboard";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/auth/login?error=${error.message}&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  redirect(redirectTo);
}

export async function signUp(formData: FormData) {
  export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://allie-emploi.vercel.app"}/auth/callback`,
      },
    });

    if (error) {
      redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);
    }

    // Créer le profil
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        username: email.split("@")[0],
        email: email,
      });
    }

    // Rediriger vers la page d'inscription avec le message de succès
    redirect("/auth/register?success=confirmation_sent");
  }
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  logger.log("signUp - email:", email, "username:", username);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    logger.error("Erreur signUp:", error);
    redirect(`/auth/register?error=${error.message}`);
  }

  // Créer le profil dans la table public.profiles
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: username || email.split("@")[0],
      email: email,
    });

    if (profileError) {
      logger.error("Erreur création profil:", profileError);
    }
  }

  // Redirection vers login avec message de succès
  redirect("/auth/register?success=confirmation_sent");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
