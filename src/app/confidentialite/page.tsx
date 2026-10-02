// src/app/confidentialite/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Plateforme Emploi 2026",
  description: "Politique de confidentialité RGPD",
};

export default function ConfidentialitePage() {
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
          Politique de confidentialité
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Dernière mise à jour : 2 octobre 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            1. Responsable du traitement
          </h2>
          <p className="text-gray-700">
            Le responsable du traitement des données est Cyril Gourdon, éditeur
            du site. Contact : cyril.gourdon.02@gmail.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Données collectées</h2>
          <p className="text-gray-700 mb-2">
            Nous collectons les données suivantes :
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>
              <strong>Compte utilisateur</strong> : email, pseudo, date
              d'inscription
            </li>
            <li>
              <strong>Contenus publiés</strong> : articles, questions, réponses,
              commentaires
            </li>
            <li>
              <strong>Newsletter</strong> : adresse email (si inscription
              volontaire)
            </li>
            <li>
              <strong>Navigation</strong> : pages visitées, date de connexion
              (logs techniques)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            3. Finalités du traitement
          </h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Gestion des comptes utilisateurs</li>
            <li>Publication et modération des contenus</li>
            <li>Envoi de la newsletter (avec consentement)</li>
            <li>Sécurité et prévention des abus</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Base légale</h2>
          <p className="text-gray-700">Le traitement repose sur :</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
            <li>
              L'exécution du contrat (CGU) pour les fonctionnalités principales
            </li>
            <li>Le consentement pour la newsletter</li>
            <li>L'intérêt légitime pour la sécurité du site</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            5. Durée de conservation
          </h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>
              <strong>Compte actif</strong> : tant que le compte est actif
            </li>
            <li>
              <strong>Compte supprimé</strong> : 3 ans après la suppression
              (preuve légale)
            </li>
            <li>
              <strong>Newsletter</strong> : jusqu'à désinscription
            </li>
            <li>
              <strong>Logs techniques</strong> : 1 an
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Vos droits (RGPD)</h2>
          <p className="text-gray-700 mb-2">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>
              <strong>Droit d'accès</strong> : obtenir une copie de vos données
            </li>
            <li>
              <strong>Droit de rectification</strong> : corriger vos données
            </li>
            <li>
              <strong>Droit à l'effacement</strong> : supprimer votre compte et
              vos données
            </li>
            <li>
              <strong>Droit à la portabilité</strong> : récupérer vos données
              dans un format lisible
            </li>
            <li>
              <strong>Droit d'opposition</strong> : vous opposer au traitement
            </li>
            <li>
              <strong>Droit de limitation</strong> : limiter le traitement de
              vos données
            </li>
          </ul>
          <p className="text-gray-700 mt-3">
            Pour exercer ces droits, contactez-nous à :{" "}
            <a
              href="mailto:cyril.gourdon.02@gmail.com"
              className="text-blue-600 hover:underline"
            >
              cyril.gourdon.02@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. Partage des données</h2>
          <p className="text-gray-700">
            Vos données ne sont jamais vendues. Elles sont hébergées par :
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
            <li>
              <strong>Vercel</strong> (hébergement) - États-Unis (clauses
              contractuelles types)
            </li>
            <li>
              <strong>Supabase</strong> (base de données) - États-Unis (clauses
              contractuelles types)
            </li>
            <li>
              <strong>Resend</strong> (envoi d'emails) - États-Unis
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
          <p className="text-gray-700">
            Le site utilise uniquement des cookies techniques nécessaires au
            fonctionnement (session utilisateur). Aucun cookie publicitaire ou
            de tracking n'est utilisé.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Réclamation</h2>
          <p className="text-gray-700">
            Vous avez le droit d'introduire une réclamation auprès de la{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CNIL
            </a>{" "}
            si vous estimez que vos droits ne sont pas respectés.
          </p>
        </section>
      </div>
    </main>
  );
}
