"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Resend } from "resend";
import { render } from "@react-email/render";
import AnswerApproved from "@/emails/answer-approved";
import { logger } from "@/utils/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function publishArticle(formData: FormData): Promise<void> {
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
    return;
  }

  const articleId = formData.get("articleId") as string;

  await supabase
    .from("articles")
    .update({ status: "published" })
    .eq("id", articleId);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function archiveArticle(formData: FormData): Promise<void> {
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
    return;
  }

  const articleId = formData.get("articleId") as string;

  await supabase
    .from("articles")
    .update({ status: "archived" })
    .eq("id", articleId);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function approveComment(formData: FormData): Promise<void> {
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
    return;
  }

  const commentId = formData.get("commentId") as string;

  await supabase
    .from("comments")
    .update({ status: "approved" })
    .eq("id", commentId);

  revalidatePath("/admin");
}

export async function rejectComment(formData: FormData): Promise<void> {
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
    return;
  }

  const commentId = formData.get("commentId") as string;

  await supabase
    .from("comments")
    .update({ status: "rejected" })
    .eq("id", commentId);

  revalidatePath("/admin");
}

export async function publishQuestion(formData: FormData): Promise<void> {
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
    return;
  }

  const questionId = formData.get("questionId") as string;

  await supabase
    .from("questions")
    .update({ status: "published" })
    .eq("id", questionId);

  revalidatePath("/admin");
  revalidatePath("/questions");
}

export async function rejectQuestion(formData: FormData): Promise<void> {
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
    return;
  }

  const questionId = formData.get("questionId") as string;

  await supabase
    .from("questions")
    .update({ status: "archived" })
    .eq("id", questionId);

  revalidatePath("/admin");
}

export async function approveAnswer(formData: FormData): Promise<void> {
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
    return;
  }

  const answerId = formData.get("answerId") as string;

  // 1. Récupérer la réponse avec les infos de la question et de l'auteur
  const { data: answer } = await supabase
    .from("answers")
    .select(
      `
      id, content, question_id,
      questions!inner (id, title, slug, author_id),
      profiles:author_id (username)
    `,
    )
    .eq("id", answerId)
    .single();

  if (!answer) return;

  // 2. Approuver la réponse
  await supabase
    .from("answers")
    .update({ status: "approved" })
    .eq("id", answerId);

  // 3. Récupérer l'email de l'auteur de la question
  const { data: questionAuthor } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", (answer.questions as any).author_id)
    .single();

  // 4. Envoyer l'email si l'auteur existe
  if (questionAuthor?.email) {
    try {
      const html = await render(
        AnswerApproved({
          questionTitle: (answer.questions as any).title,
          questionSlug: (answer.questions as any).slug,
          answerContent: answer.content,
          authorName: (answer.profiles as any)?.username || "Un membre",
        }),
      );

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: questionAuthor.email,
        subject: `✅ Nouvelle réponse à votre question : ${(answer.questions as any).title}`,
        html,
      });

      logger.log("Email envoyé à:", questionAuthor.email);
    } catch (error) {
      logger.error("Erreur envoi email:", error);
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/questions/${(answer.questions as any).slug}`);
}

export async function rejectAnswer(formData: FormData): Promise<void> {
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
    return;
  }

  const answerId = formData.get("answerId") as string;

  await supabase
    .from("answers")
    .update({ status: "rejected" })
    .eq("id", answerId);

  revalidatePath("/admin");
}

// ... (garder toutes les fonctions existantes)
