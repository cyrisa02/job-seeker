"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  await supabase
    .from("answers")
    .update({ status: "approved" })
    .eq("id", answerId);

  revalidatePath("/admin");
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
