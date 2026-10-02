// src/app/api/newsletter/send/route.ts

import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import WeeklyDigest from "@/emails/weekly-digest";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const supabase = await createClient();

  // 1. Récupérer les articles de la semaine
  const oneWeekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: articles } = await supabase
    .from("articles")
    .select("title, slug, profiles:author_id (username)")
    .eq("status", "published")
    .gte("created_at", oneWeekAgo)
    .order("created_at", { ascending: false });

  // 2. Récupérer les questions résolues de la semaine
  const { data: resolvedQuestions } = await supabase
    .from("questions")
    .select("title, slug")
    .eq("status", "published")
    .eq("is_resolved", true)
    .gte("updated_at", oneWeekAgo)
    .order("updated_at", { ascending: false });

  // 3. Récupérer les abonnés newsletter
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("is_active", true);

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "Aucun abonné" });
  }

  const weekRange = `${new Date(oneWeekAgo).toLocaleDateString("fr-FR")} - ${new Date().toLocaleDateString("fr-FR")}`;

  const articlesFormatted = (articles || []).map((a: any) => ({
    title: a.title,
    slug: a.slug,
    author: a.profiles?.username || "Anonyme",
  }));

  const questionsFormatted = (resolvedQuestions || []).map((q: any) => ({
    title: q.title,
    slug: q.slug,
  }));

  // 4. Envoyer à chaque abonné
  const emailPromises = subscribers.map(async (sub: any) => {
    const html = await render(
      WeeklyDigest({
        articles: articlesFormatted,
        resolvedQuestions: questionsFormatted,
        weekRange,
      }),
    );

    return resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: sub.email,
      subject: `📬 Votre récap hebdo - ${weekRange}`,
      html,
    });
  });

  await Promise.all(emailPromises);

  return NextResponse.json({
    message: `Newsletter envoyée à ${subscribers.length} abonnés`,
    articles: articlesFormatted.length,
    questions: questionsFormatted.length,
  });
}
