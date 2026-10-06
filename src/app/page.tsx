// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import NewsletterForm from "@/components/NewsletterForm";
import Pagination from "@/components/Pagination";
import { logout } from "@/app/auth/actions";
import type { Metadata } from "next";
import Image from "next/image";

const ARTICLES_PER_PAGE = 6;

export const metadata: Metadata = {
  title: "Allié Emploi - Entraide pour demandeurs d'emploi",
  description:
    "Guides, astuces et témoignages pour les demandeurs d'emploi en France. Une communauté bienveillante pour vous accompagner.",
};

interface HomeProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  const searchTerm = q?.trim() || "";

  let articlesQuery = supabase
    .from("articles")
    .select(`id, title, slug, created_at, profiles:author_id (username)`, {
      count: "exact",
    })
    .eq("status", "published");

  if (searchTerm.length > 0) {
    articlesQuery = articlesQuery.or(
      `title.ilike.%${searchTerm}%,content_md.ilike.%${searchTerm}%`,
    );
  }

  articlesQuery = articlesQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: articles, count: totalArticles } = await articlesQuery;
  const totalPages = Math.ceil((totalArticles || 0) / ARTICLES_PER_PAGE);

  // Récupérer quelques questions résolues pour les exemples
  const { data: exampleQuestions } = await supabase
    .from("questions")
    .select(
      `
      id, title, slug, is_resolved, created_at,
      profiles:author_id (username),
      answers (id, status)
    `,
    )
    .eq("status", "published")
    .eq("is_resolved", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const questionsWithCounts =
    exampleQuestions?.map((q) => ({
      ...q,
      answersCount:
        (q.answers as any[])?.filter((a: any) => a.status === "approved")
          .length || 0,
    })) || [];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Allié Emploi
          </Link>
          <nav className="flex gap-6 items-center">
            <Link
              href="/articles"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/questions"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Questions
            </Link>
            <Link
              href="/stats"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Stats
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Se déconnecter
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur la plateforme
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Guides, astuces et témoignages pour les demandeurs d'emploi en
            France. Une communauté bienveillante pour vous accompagner.
          </p>
          <SearchBar />
          <div className="mt-8">
            <Link
              href="/questions/guide"
              className="text-blue-200 hover:text-white text-sm underline flex items-center justify-center gap-1"
            >
              📖 Comment bien poser sa question
            </Link>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi ce site" */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi ce site ?
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                <Image
                  src="/images/cyril.jpg"
                  alt="Cyril, fondateur d'Allié Emploi"
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Mon histoire
                </h3>
                <p className="text-gray-600 italic">
                  Fondé par Cyril, après 2 ans de chômage
                </p>
              </div>
            </div>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                <strong className="text-blue-900">
                  Pendant longtemps, j'ai été au chômage.
                </strong>{" "}
                Pas juste quelques semaines. Des mois. Des mois où chaque matin,
                je me réveillais avec la même angoisse : comment vais-je m'en
                sortir ?
              </p>

              <p>
                J'ai cherché de l'aide. Partout. Pôle Emploi, sites web,
                forums... Mais souvent, je me suis retrouvé seul face à mes
                questions. Les réponses étaient techniques, froides, ou pire :
                inexistantes.
              </p>

              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600 shadow-sm">
                <p className="text-gray-800 font-medium mb-3">
                  Ce qui m'a le plus manqué ?
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>
                      Discuter avec d'autres chômeurs qui comprennent vraiment
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>Poser des questions simples sans jugement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>
                      Avoir des réponses de gens qui ont vécu la même chose
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>Ne pas me sentir seul dans cette galère</span>
                  </li>
                </ul>
              </div>

              <p>
                J'aurais voulu pouvoir parler à un patron bienveillant, à un
                ancien chômeur qui s'en est sorti, à quelqu'un qui comprend.
                Mais ces conversations, je ne les ai pas eues.
              </p>

              <p className="text-xl font-semibold text-blue-900">
                Alors j'ai créé ce site. Pour que personne ne vive ça seul.
              </p>

              <p>
                Ici, vous trouverez des guides pratiques, oui. Mais surtout,
                vous trouverez une communauté. Des gens qui posent les mêmes
                questions que vous. Des gens qui répondent avec bienveillance.
                Des gens qui comprennent.
              </p>

              <div className="bg-blue-600 text-white rounded-lg p-6 text-center mt-8">
                <p className="text-lg font-medium">
                  Ce site est gratuit, sans publicité, et fait avec le cœur.
                </p>
                <p className="text-blue-100 text-sm mt-2">
                  Parce que l'entraide, ça devrait être la norme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Exemples de bonnes questions" */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Exemples de bonnes questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Voici des questions réelles posées par notre communauté. Elles ont
              reçu des réponses utiles parce qu'elles étaient claires et
              détaillées.
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>

          {questionsWithCounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {questionsWithCounts.map((q) => (
                <Link
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      ✓ Résolue
                    </span>
                    <span className="text-xs text-gray-500">
                      {q.answersCount} réponse{q.answersCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {q.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {(q.profiles as any)?.username || "Anonyme"} •{" "}
                    {new Date(q.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-12">
              <p className="text-gray-500 mb-4">
                Les questions résolues apparaîtront ici bientôt.
              </p>
            </div>
          )}

          {/* Comparaison mauvaise vs bonne question */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">❌</span>
                <h3 className="text-xl font-bold text-red-900">
                  Mauvaise question
                </h3>
              </div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-gray-800 font-medium">"Aide moi svp"</p>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Trop vague : on ne sait pas ce qu'il cherche</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Aucun contexte : statut, situation, région ?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Difficile à répondre utilement</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold text-green-900">
                  Bonne question
                </h3>
              </div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-gray-800 font-medium">
                  "Comment négocier une rupture conventionnelle après 2 ans
                  d'ancienneté dans le marketing ?"
                </p>
              </div>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Précise : sujet clair dès le titre</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Contexte : ancienneté, secteur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Facile à répondre avec des conseils concrets</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/questions/guide"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              📖 Lire le guide complet pour bien poser sa question
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Explorer par thème
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/questions?categorie=${category.slug}`}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles récents */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Articles récents
          </h2>
          {articles && articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(article.profiles as any)?.username || "Anonyme"} •{" "}
                      {new Date(article.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </Link>
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/"
                searchParams={searchTerm ? { q: searchTerm } : {}}
              />
            </>
          ) : (
            <p className="text-center text-gray-500">
              Aucun article publié pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            📬 Recevez nos meilleurs conseils
          </h2>
          <p className="text-blue-100 mb-8">
            Une newsletter hebdomadaire avec les nouveaux articles et questions
            résolues.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/articles"
                    className="hover:text-white transition-colors"
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/questions"
                    className="hover:text-white transition-colors"
                  >
                    Questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stats"
                    className="hover:text-white transition-colors"
                  >
                    Statistiques
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="hover:text-white transition-colors"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cgu"
                    className="hover:text-white transition-colors"
                  >
                    CGU
                  </Link>
                </li>
                <li>
                  <Link
                    href="/confidentialite"
                    className="hover:text-white transition-colors"
                  >
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-sm">
                Une question ? Un problème ?<br />
                Écrivez-nous à alicia.gpt.02@gmail.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              © 2026 Allié Emploi. Fait avec 💙 pour les demandeurs d'emploi.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
