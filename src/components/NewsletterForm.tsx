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
    <form onSubmit={handleSubmit} className="space-y-3">
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
          ✓ Inscription confirmée !
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          Erreur. Vérifiez votre email.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Votre adresse email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors whitespace-nowrap"
        >
          {status === "submitting" ? "Envoi..." : "S'inscrire"}
        </button>
      </div>
    </form>
  );
}
