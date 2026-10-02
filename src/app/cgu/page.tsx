// src/app/cgu/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Plateforme Emploi 2026",
  description: "CGU de la plateforme",
};

export default function CGUPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Dernière mise à jour : 2 octobre 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Objet</h2>
          <p className="text-gray-700">
            Les présentes CGU régissent l'utilisation de la plateforme
            Plateforme Emploi 2026, un site communautaire d'entraide pour les
            demandeurs d'emploi en France.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            2. Inscription et compte utilisateur
          </h2>
          <p className="text-gray-700 mb-2">
            L'inscription est gratuite et nécessite une adresse email valide.
            L'utilisateur s'engage à :
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Fournir des informations exactes</li>
            <li>Ne pas créer de faux comptes</li>
            <li>Protéger ses identifiants de connexion</li>
            <li>Avoir au moins 16 ans</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            3. Règles de publication
          </h2>
          <p className="text-gray-700 mb-2">
            Tout contenu publié (articles, questions, réponses, commentaires)
            doit :
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Être respectueux et bienveillant</li>
            <li>
              Ne pas contenir de propos discriminatoires, haineux ou illégaux
            </li>
            <li>Ne pas faire de publicité commerciale</li>
            <li>Ne pas divulguer d'informations personnelles d'autrui</li>
            <li>Être pertinent pour le thème de la plateforme</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Tous les contenus sont soumis à modération avant publication.
            L'éditeur se réserve le droit de refuser ou supprimer tout contenu
            non conforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Responsabilité</h2>
          <p className="text-gray-700">
            La plateforme fournit un espace d'échange communautaire. Les
            conseils partagés sont donnés à titre informatif et ne remplacent
            pas un accompagnement professionnel (Pôle Emploi, avocat, assistante
            sociale). L'éditeur ne saurait être tenu responsable des décisions
            prises par les utilisateurs sur la base des contenus publiés.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            5. Suspension et suppression
          </h2>
          <p className="text-gray-700">
            L'éditeur peut suspendre ou supprimer un compte utilisateur en cas
            de non-respect des présentes CGU, sans préavis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            6. Modification des CGU
          </h2>
          <p className="text-gray-700">
            Les CGU peuvent être modifiées à tout moment. Les utilisateurs
            seront informés des changements importants par email.
          </p>
        </section>
      </div>
    </main>
  );
}
