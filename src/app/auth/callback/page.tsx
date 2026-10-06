// src/app/auth/callback/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthCallback() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login?error=confirmation_failed");
  }

  // Vérifier si un profil existe
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      username: user.email?.split("@")[0] || "utilisateur",
      email: user.email,
    });
  }

  // Rediriger vers le dashboard
  redirect("/dashboard");
}
