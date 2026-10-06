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
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  logger.log("signUp - email:", email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://allie-emploi.vercel.app"}/auth/callback`,
    },
  });

  if (error) {
    logger.error("Erreur signUp:", error);
    redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);
  }

  // Créer le profil
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: email.split("@")[0],
      email: email,
    });

    if (profileError) {
      logger.error("Erreur création profil:", profileError);
    }
  }

  // Rediriger vers la page d'inscription avec le message de succès
  redirect("/auth/register?success=confirmation_sent");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    redirect("/auth/forgot-password?error=Email requis");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://allie-emploi.vercel.app"}/auth/reset-password`,
  });

  if (error) {
    redirect(
      `/auth/forgot-password?error=${encodeURIComponent(error.message)}`,
    );
  }

  // Toujours rediriger vers succès (pour ne pas révéler quels emails existent)
  redirect("/auth/forgot-password?success=email_sent");
}
