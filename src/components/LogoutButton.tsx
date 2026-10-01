// src/components/LogoutButton.tsx

"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium"
    >
      Se déconnecter
    </button>
  );
}
