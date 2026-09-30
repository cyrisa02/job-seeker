// src/components/ProfilForm.tsx

"use client";

import { useState } from "react";
import { updateProfil } from "@/app/dashboard/profil/actions";

interface ProfilFormProps {
  profile: {
    id: string;
    username: string;
    bio: string | null;
  };
}

export default function ProfilForm({ profile }: ProfilFormProps) {
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError("");

    try {
      const result = await updateProfil(formData);

      if (result?.error) {
        setError(result.error);
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setStatus("error");
    }
  }

  return (
    <form
      action={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
          Profil mis à jour avec succès !
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Nom d'utilisateur
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="votre-pseudo"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Bio (optionnel)
        </label>
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={500}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Parlez de vous, de votre parcours..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {bio.length}/500 caractères
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
