export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Vérifiez votre email</h1>
        <p className="text-gray-600">
          Un lien de confirmation a été envoyé à votre adresse email. Cliquez
          dessus pour activer votre compte.
        </p>
        <a
          href="/auth/login"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          Retour à la connexion
        </a>
      </div>
    </div>
  );
}
