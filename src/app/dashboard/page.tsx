import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .single();

  // Récupérer les articles soumis par l'utilisateur
  const { data: myArticles } = await supabase
    .from("articles")
    .select("id, title, slug, status, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Connecté en tant que{" "}
            <span className="font-semibold">{user.email}</span>
            {profile?.role && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {profile.role}
              </span>
            )}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Soumettre un article</h2>
          <ArticleForm userId={user.id} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Mes articles soumis</h2>
          {myArticles && myArticles.length > 0 ? (
            <ul className="space-y-3">
              {myArticles.map((article) => (
                <li key={article.id} className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : article.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {article.status === "published"
                        ? "Publié"
                        : article.status === "pending"
                        ? "En attente"
                        : "Archivé"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              Vous n'avez pas encore soumis d'articles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
