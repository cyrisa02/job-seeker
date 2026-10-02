// src/components/NewsletterForm.tsx

"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setEmail("");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-2">📬 Newsletter hebdomadaire</h3>
      <p className="text-sm text-gray-600 mb-4">
        Recevez chaque lundi les nouveaux articles et questions résolues.
      </p>

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm mb-4">
          ✓ Inscription confirmée !
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm mb-4">
          Erreur. Vérifiez votre email.
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "submitting" ? "..." : "S'inscrire"}
        </button>
      </div>
    </form>
  );
}
