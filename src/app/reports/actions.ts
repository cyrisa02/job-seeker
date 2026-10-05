// src/app/reports/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/utils/logger";

export async function submitReport(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté pour signaler un contenu" };
  }

  const contentType = formData.get("contentType") as string;
  const contentId = formData.get("contentId") as string;
  const reason = formData.get("reason") as string;

  if (!contentType || !contentId || !reason) {
    return { error: "Données manquantes" };
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    content_type: contentType,
    content_id: contentId,
    reason: reason.trim(),
    status: "pending",
  });

  if (error) {
    logger.error("Erreur submitReport:", error);
    return { error: "Erreur lors du signalement" };
  }

  // Revalider la page pour masquer le bouton ou afficher un message
  revalidatePath(`/articles/[slug]`);
  revalidatePath(`/questions/[slug]`);

  return { success: true };
}
