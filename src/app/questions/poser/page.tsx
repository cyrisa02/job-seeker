// src/app/questions/poser/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import QuestionForm from "@/components/QuestionForm";
import Link from "next/link";
import { logger } from "@/utils/logger"; // ← AJOUT

export default async function AskQuestionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  logger.log("AskQuestionPage - categories:", categories);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/questions"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour aux questions
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Poser une question</h1>
          <p className="text-gray-600 mb-8">
            Décrivez votre situation clairement. La communauté vous répondra.
          </p>
          <QuestionForm userId={user.id} categories={categories || []} />
        </div>
      </div>
    </main>
  );
}
