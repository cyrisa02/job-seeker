// src/app/auth/register/page.tsx

import { signUp } from "../actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription | Allié Emploi",
  description:
    "Créez votre compte Allié Emploi gratuitement et rejoignez la communauté d'entraide pour demandeurs d'emploi.",
  robots: {
    index: false,
    follow: false,
  },
};

interface SignupPageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, success } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Rejoignez la communauté Allié Emploi
        </p>

        {/* Message de succès : email de confirmation envoyé */}
        {success === "confirmation_sent" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-sm">
            <p className="font-semibold mb-1">✅ Inscription réussie !</p>
            <p>
              Un email de confirmation vient de vous être envoyé. Cliquez sur le
              lien dans l'email pour activer votre compte.
            </p>
            <p className="mt-2 text-xs text-blue-600">
              Pensez à vérifier vos spams si vous ne le recevez pas.
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error.includes("already")
              ? "Cet email est déjà utilisé."
              : "Une erreur est survenue lors de l'inscription."}
          </div>
        )}

        <form className="flex flex-col gap-4" action={signUp}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mot de passe (6 caractères minimum)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
