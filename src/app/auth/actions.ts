"use server";
import { getAuthSiteOrigin, safeNext } from "@/lib/config";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  emailSchema,
  passwordUpdateSchema,
} from "@/lib/validation";
export type AuthState = {
  error?: string;
  message?: string;
  confirmationRequired?: boolean;
  success?: boolean;
};
const unavailable =
  "Sèvis kont lan pa disponib kounye a. Tanpri eseye ankò pita.";
function deliveryError(error: { code?: string; status?: number }): AuthState {
  if (
    error.status === 429 ||
    error.code === "over_email_send_rate_limit" ||
    error.code === "over_request_rate_limit"
  )
    return {
      error: "Gen twòp demann. Tanpri tann kèk minit anvan ou eseye ankò.",
    };
  return { error: "Nou pa rive voye imèl la. Tanpri eseye ankò pita." };
}
export async function authenticate(
  mode: "login" | "signup" | "reset",
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  if (!["login", "signup", "reset"].includes(mode))
    return { error: "Demann sa a pa valab." };
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
        : loginSchema;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  if (!supabase) return { error: unavailable };
  const email = parsed.data.email;
  if (mode === "login") {
    let result;
    try {
      result = await supabase.auth.signInWithPassword({
        email,
        password: String(raw.password),
      });
    } catch {
      return { error: unavailable };
    }
    if (result.error) {
      if (result.error.code === "email_not_confirmed")
        return {
          error: "Tanpri konfime adrès imèl ou anvan ou konekte.",
          confirmationRequired: true,
        };
      if (result.error.status === 429) return deliveryError(result.error);
      return {
        error:
          "Nou pa rive konekte ou. Verifye imèl ou ak modpas ou, oswa eseye ankò pita.",
      };
    }
    if (!result.data.session) return { error: unavailable };
    revalidatePath("/", "layout");
    redirect(
      safeNext(
        typeof form.get("next") === "string" ? String(form.get("next")) : null,
      ),
    );
  }
  const origin = getAuthSiteOrigin();
  if (!origin)
    return { error: "Sèvis imèl la poko konfigire. Tanpri tounen pita." };
  if (mode === "signup") {
    let result;
    try {
      result = await supabase.auth.signUp({
        email,
        password: String(raw.password),
        options: {
          data: { display_name: String(raw.displayName).trim() },
          emailRedirectTo: `${origin}/auth/confirm`,
        },
      });
    } catch {
      return { error: unavailable };
    }
    if (result.error) return deliveryError(result.error);
    if (result.data.session) {
      revalidatePath("/", "layout");
      redirect("/tablo-bod");
    }
    return {
      confirmationRequired: true,
      message:
        "Si adrès sa a ka itilize pou yon nouvo kont, w ap resevwa yon imèl pou konfime li. Verifye bwat resepsyon ou ak bwat endezirab la.",
    };
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/confirm?next=/kont/modpas`,
    });
    if (error) return deliveryError(error);
  } catch {
    return { error: unavailable };
  }
  return {
    message:
      "Si adrès sa a gen yon kont, w ap resevwa yon imèl ak etap pou chanje modpas ou. Louvri lyen an nan menm navigatè sa a.",
  };
}
export async function resendConfirmation(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  const parsed = emailSchema.safeParse({ email: form.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const origin = getAuthSiteOrigin();
  if (!supabase || !origin) return { error: unavailable };
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: parsed.data.email,
      options: { emailRedirectTo: `${origin}/auth/confirm` },
    });
    if (error) return deliveryError(error);
  } catch {
    return { error: unavailable };
  }
  return {
    message:
      "Si kont sa a bezwen konfimasyon, n ap voye yon nouvo imèl. Verifye bwat resepsyon ou ak bwat endezirab la.",
  };
}
export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    let failed = false;
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      failed = !!error;
    } catch {
      failed = true;
    }
    if (failed) redirect("/tablo-bod?eta=dekoneksyon");
  }
  revalidatePath("/", "layout");
  redirect("/konekte?eta=dekonekte");
}
export async function updatePassword(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  const parsed = passwordUpdateSchema.safeParse({
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  if (!supabase) return { error: unavailable };
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return {
        error:
          "Lyen an ka ekspire. Mande yon nouvo lyen rekiperasyon oswa konekte ankò.",
      };
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (error) {
      if (error.code === "same_password")
        return { error: "Chwazi yon modpas ki diferan ak ansyen modpas ou." };
      if (
        error.code === "reauthentication_needed" ||
        error.code === "reauthentication_not_valid"
      )
        return {
          error:
            "Pou sekirite ou, mande yon nouvo lyen rekiperasyon epi eseye ankò.",
        };
      return {
        error:
          "Nou pa rive chanje modpas la. Mande yon nouvo lyen oswa eseye ankò pita.",
      };
    }
  } catch {
    return { error: unavailable };
  }
  revalidatePath("/", "layout");
  return { success: true, message: "Modpas ou chanje. Ou ka kontinye aprann." };
}
