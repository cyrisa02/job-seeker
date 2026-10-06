// src/components/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

interface NavbarProps {
  user: any;
  currentPage?: string; // "articles", "questions", "stats", "dashboard"
}

export default function Navbar({ user, currentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/articles", label: "Articles", active: currentPage === "articles" },
    { href: "/questions", label: "Questions", active: currentPage === "questions" },
    { href: "/stats", label: "Stats", active: currentPage === "stats" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 flex-shrink-0">
            Allié Emploi
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.active
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600 transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={
                    currentPage === "dashboard"
                      ? "text-blue-600 font-medium"
                      : "text-blue-600 hover:text-blue-700 font-medium"
                  }
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Se déconnecter
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Se connecter
              </Link>
            )}
          </nav>

          {/* Burger button (mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-gray-700 transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-gray-700 transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-gray-700 transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={
                  link.active
                    ? "text-blue-600 font-medium py-2"
                    : "text-gray-600 hover:text-blue-600 py-2 transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 font-medium py-2"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm text-left"
                  >
                    Se déconnecter
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Se connecter
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}