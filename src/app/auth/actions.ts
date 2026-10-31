"use server";
import { getAuthSiteOrigin } from "@/lib/config";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { credentialsSchema, signupSchema, emailSchema } from "@/lib/validation";
export type AuthState = { error?: string; message?: string };
export async function authenticate(
  mode: "login" | "signup" | "reset",
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase)
    return {
      error: "Koneksyon ak sèvis kont lan poko konfigire. Tanpri tounen pita.",
    };
  const raw = {
    email: form.get("email"),
    password: form.get("password"),
    displayName: form.get("displayName"),
    acceptTerms: form.get("acceptTerms") === "on",
  };
  const schema =
    mode === "signup"
      ? signupSchema
      : mode === "reset"
        ? emailSchema
        : credentialsSchema;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const siteUrl = getAuthSiteOrigin();
  if (mode === "login") {
    const result = await supabase.auth.signInWithPassword({
      email: String(raw.email),
      password: String(raw.password),
    });
    if (result.error)
      return {
        error:
          "Nou pa rive konekte ou. Verifye imèl ou ak modpas ou, oswa eseye ankò pita.",
      };
    redirect("/tablo-bod");
  }
  if (!siteUrl)
    return { error: "Sèvis imèl la poko konfigire. Tanpri tounen pita." };
  if (mode === "signup") {
    const result = await supabase.auth.signUp({
      email: String(raw.email),
      password: String(raw.password),
      options: {
        data: { display_name: String(raw.displayName) },
        emailRedirectTo: `${siteUrl}/auth/confirm`,
      },
    });
    if (result.error)
      return { error: "Nou pa rive trete demann lan. Tanpri eseye ankò pita." };
    return {
      message:
        "Si adrès sa a ka itilize pou yon nouvo kont, w ap resevwa yon imèl pou konfime li. Verifye bwat resepsyon ou.",
    };
  }
  await supabase.auth.resetPasswordForEmail(String(raw.email), {
    redirectTo: `${siteUrl}/auth/confirm?next=/kont/modpas`,
  });
  return {
    message:
      "Si adrès sa a gen yon kont, w ap resevwa yon imèl ak etap pou chanje modpas ou.",
  };
}
export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/konekte");
}
export async function updatePassword(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  const parsed = credentialsSchema.shape.password.safeParse(
    form.get("password"),
  );
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  if (!supabase) return { error: "Sèvis kont lan pa disponib." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tanpri konekte ankò pou chanje modpas ou." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error)
    return {
      error:
        "Nou pa rive chanje modpas la. Eseye ankò oswa mande yon nouvo lyen.",
    };
  return { message: "Modpas ou chanje. Ou ka kontinye aprann." };
}
