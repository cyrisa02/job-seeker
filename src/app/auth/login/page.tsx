// src/app/auth/login/page.tsx

import { signIn } from "../actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Allié Emploi",
  description:
    "Connectez-vous à votre compte Allié Emploi pour accéder à votre dashboard et participer à la communauté.",
  robots: {
    index: false, // Page de connexion : ne pas indexer
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
    error?: string;
    success?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, error, success } = await searchParams;
  const redirectUrl = redirect || "/dashboard";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Connexion</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Accédez à votre espace personnel
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error === "Invalid login credentials"
              ? "Email ou mot de passe incorrect."
              : "Une erreur est survenue."}
          </div>
        )}

        {success === "account_created" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            ✓ Compte créé avec succès ! Connectez-vous.
          </div>
        )}

        <form className="flex flex-col gap-4" action={signIn}>
          <input type="hidden" name="redirect" value={redirectUrl} />

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
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
