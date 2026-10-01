// src/app/dashboard/profil/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfilForm from "@/components/ProfilForm";
import PasswordForm from "@/components/PasswordForm";

export default async function EditProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, bio")
    .eq("id", user.id)
    .single();

  logger.log("EditProfilPage - profile:", profile);

  if (!profile) {
    logger.log("EditProfilPage - profile not found, redirecting");
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <ProfilForm profile={profile} />
        <PasswordForm />
      </div>
    </div>
  );
}
