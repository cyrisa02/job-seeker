// src/components/PasswordForm.tsx

"use client";

import { useState } from "react";
import { changePassword } from "@/app/dashboard/profil/actions";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError("");

    try {
      const result = await changePassword(formData);

      if (result?.error) {
        setError(result.error);
        setStatus("error");
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setStatus("error");
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
          Mot de passe modifié avec succès !
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
          Mot de passe actuel
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          Nouveau mot de passe (min. 6 caractères)
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-gray-700 text-white font-semibold py-2 px-6 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Modification..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}