// src/components/ReportButton.tsx

"use client";

import { useState } from "react";
import { submitReport } from "@/app/reports/actions";
import { useRouter } from "next/navigation";

interface ReportButtonProps {
  contentType: "article" | "question" | "answer";
  contentId: string;
  isSignedIn: boolean; // ← NOUVEAU
}

export default function ReportButton({
  contentType,
  contentId,
  isSignedIn,
}: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [reason, setReason] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSignedIn) {
      // Rediriger vers le login avec retour à la page actuelle
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setStatus("submitting");

    const formData = new FormData();
    formData.append("contentType", contentType);
    formData.append("contentId", contentId);
    formData.append("reason", reason);

    const result = await submitReport(formData);

    if (result?.error) {
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setReason("");
      }, 2000);
    }
  }

  if (status === "success") {
    return (
      <span className="text-sm text-green-600 font-medium">
        ✓ Signalement envoyé
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
        title="Signaler ce contenu"
      >
        <span>🚩</span> Signaler
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <h4 className="text-sm font-semibold mb-2">
            Signaler ce {contentType}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="">Choisir un motif...</option>
              <option value="spam">Spam ou publicité</option>
              <option value="harassment">Harcèlement ou haine</option>
              <option value="misinformation">Fausses informations</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="other">Autre</option>
            </select>

            {status === "error" && (
              <p className="text-xs text-red-600">Erreur, réessayez.</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-sm text-gray-600 hover:bg-gray-100 py-1.5 rounded"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={status === "submitting" || !reason}
                className="flex-1 text-sm bg-red-600 text-white hover:bg-red-700 py-1.5 rounded disabled:opacity-50"
              >
                {status === "submitting" ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
