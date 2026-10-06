// src/app/questions/guide/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment bien poser sa question | Allié Emploi",
  description:
    "Guide complet pour formuler une question claire et obtenir des réponses utiles de la communauté Allié Emploi. Exemples et conseils pratiques.",
  keywords: ["guide", "poser question", "conseils", "communauté", "entraide"],
};

export default function GuidePage() {
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
          <h1 className="text-4xl font-bold mb-4">
            📝 Comment bien poser sa question
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Une question claire et détaillée reçoit 3x plus de réponses utiles.
          </p>

          {/* Les 5 règles d'or */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Les 5 règles d'or</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  1️⃣
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Soyez précis dans le titre
                  </h3>
                  <p className="text-gray-700">
                    Le titre doit résumer votre question en une phrase claire.
                    Évitez les titres vagues.
                  </p>
                  <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <p className="text-sm text-red-800">
                      <strong>Mauvais :</strong> "Aide moi svp"
                    </p>
                  </div>
                  <div className="mt-2 bg-green-50 border-l-4 border-green-400 p-3 rounded">
                    <p className="text-sm text-green-800">
                      ✅ <strong>Bon :</strong> "Comment négocier une rupture
                      conventionnelle après 2 ans d'ancienneté ?"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  2️⃣
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Donnez le contexte
                  </h3>
                  <p className="text-gray-700">
                    Expliquez votre situation : votre statut actuel, votre
                    région, votre secteur d'activité. Plus on en sait, mieux on
                    peut vous aider.
                  </p>
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-700">
                      <strong>Exemple :</strong> "Je suis en CDI depuis 3 ans
                      dans le marketing à Lyon. Mon entreprise propose des
                      ruptures conventionnelles collectives..."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  3️⃣
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Posez UNE seule question
                  </h3>
                  <p className="text-gray-700">
                    Évitez de mélanger plusieurs sujets. Si vous avez plusieurs
                    questions, créez plusieurs posts.
                  </p>
                  <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <p className="text-sm text-red-800">
                      ❌ <strong>Mauvais :</strong> "Comment faire mon CV et
                      trouver un job rapidement et quels sont mes droits chômage
                      ?"
                    </p>
                  </div>
                  <div className="mt-2 bg-green-50 border-l-4 border-green-400 p-3 rounded">
                    <p className="text-sm text-green-800">
                      ✅ <strong>Bon :</strong> Une question par sujet
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  4️⃣
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Dites ce que vous avez déjà essayé
                  </h3>
                  <p className="text-gray-700">
                    Montrez que vous avez fait des recherches. Ça évite les
                    réponses basiques et aide les contributeurs à cibler leur
                    aide.
                  </p>
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-700">
                      <strong>Exemple :</strong> "J'ai déjà consulté le site de
                      Pôle Emploi et lu l'article sur les ARE, mais je ne
                      comprends pas comment calculer mon montant journalier..."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  5️⃣
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Restez respectueux et bienveillant
                  </h3>
                  <p className="text-gray-700">
                    Notre communauté est basée sur l'entraide. Les réponses sont
                    données bénévolement. Un simple "merci" fait toujours
                    plaisir !
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Template de question */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              📋 Template à copier-coller
            </h2>
            <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
              <p className="mb-4">
                <strong>Titre :</strong> [Votre question en une phrase claire]
              </p>
              <p className="mb-4">
                <strong>Ma situation :</strong>
              </p>
              <p className="mb-2 pl-4">
                • Statut actuel : [CDI, CDD, chômage, etc.]
              </p>
              <p className="mb-2 pl-4">• Ancienneté : [X mois/années]</p>
              <p className="mb-2 pl-4">• Secteur : [Votre domaine]</p>
              <p className="mb-2 pl-4">• Région : [Votre ville/département]</p>
              <p className="mb-4">
                <strong>Ma question :</strong>
              </p>
              <p className="mb-4 pl-4">[Décrivez votre question en détail]</p>
              <p>
                <strong>Ce que j'ai déjà essayé :</strong>
              </p>
              <p className="pl-4">[Vos recherches, démarches, etc.]</p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Prêt à poser votre question ?
            </h2>
            <p className="text-gray-700 mb-6">
              Suivez ces conseils et notre communauté vous répondra rapidement.
            </p>
            <Link
              href="/questions/poser"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Poser ma question maintenant →
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
