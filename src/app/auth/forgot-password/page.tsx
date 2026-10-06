// src/app/auth/forgot-password/page.tsx

import { requestPasswordReset } from "../actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié | Allié Emploi",
  description: "Réinitialisez votre mot de passe Allié Emploi.",
  robots: { index: false, follow: false },
};

interface ForgotPasswordPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { success, error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Mot de passe oublié
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Entrez votre email, nous vous enverrons un lien de réinitialisation.
        </p>

        {success === "email_sent" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-sm">
            <p className="font-semibold mb-1">✅ Email envoyé !</p>
            <p>
              Si un compte existe avec cet email, vous recevrez un lien de
              réinitialisation. Pensez à vérifier vos spams.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" action={requestPasswordReset}>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
