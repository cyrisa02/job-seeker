// src/app/api/newsletter/subscribe/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, is_active: true }, { onConflict: "email" });

  if (error) {
    return NextResponse.json(
      { error: "Erreur d'inscription" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
