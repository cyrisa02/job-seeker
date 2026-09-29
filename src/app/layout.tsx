import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Plateforme Emploi 2026 - Aide aux demandeurs d'emploi",
    template: "%s | Plateforme Emploi 2026",
  },
  description:
    "Guides, astuces et témoignages pour les demandeurs d'emploi en France. Droits, allocations, CV, formation, reconversion.",
  keywords: [
    "demandeur emploi",
    "France Travail",
    "ARE",
    "RSA",
    "chômage 2026",
    "reconversion",
    "formation CPF",
  ],
  authors: [{ name: "Plateforme Emploi 2026" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Plateforme Emploi 2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
