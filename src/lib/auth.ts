import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { can, type Capability } from "@/lib/permissions";
export async function requireUser() {
  const supabase = await createClient();
  if (!supabase) redirect("/konekte?eta=konfigirasyon");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/konekte");
  return { supabase, user };
}
export async function requireCapability(capability: Capability) {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { data: assurance }] = await Promise.all([
    supabase
      .from("profiles")
      .select("role,display_name")
      .eq("id", user.id)
      .single(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);
  if (!can(profile?.role, capability, assurance?.currentLevel))
    redirect("/tablo-bod?eta=aksè");
  return { supabase, user, profile };
}
