import { signIn } from "../actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <form className="flex w-full max-w-sm flex-col gap-4" action={signIn}>
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>

        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
