"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthSiteOrigin, getSupabaseConfig } from "@/lib/config";
import type { AuthState } from "@/app/auth/actions";

export async function signInWithGoogle(
  mode: "login" | "signup",
  _state: AuthState,
  form: FormData,
): Promise<AuthState> {
  if (mode !== "login" && mode !== "signup")
    return { error: "Demann sa a pa valab." };
  if (form.get("acceptTerms") !== "on")
    return { error: "Ou dwe aksepte kondisyon itilizasyon yo." };
  const origin = getAuthSiteOrigin();
  const config = getSupabaseConfig();
  if (!origin || !config)
    return { error: "Koneksyon Google la poko konfigire. Tanpri tounen pita." };
  const supabase = await createClient();
  if (!supabase) return { error: "Sèvis kont lan pa disponib." };
  // Supabase SSR creates and stores the PKCE verifier in session cookies.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/confirm`,
      scopes: "email profile",
      skipBrowserRedirect: true,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url)
    return {
      error: "Nou pa rive kòmanse koneksyon Google la. Tanpri eseye ankò.",
    };
  // Never turn an unexpected SDK response into an arbitrary redirect.
  let destination: URL;
  try {
    destination = new URL(data.url);
  } catch {
    return { error: "Koneksyon Google la pa disponib." };
  }
  if (
    destination.origin !== new URL(config.url).origin ||
    destination.pathname !== "/auth/v1/authorize" ||
    destination.username ||
    destination.password
  )
    return { error: "Koneksyon Google la pa disponib." };
  redirect(destination.href);
}
