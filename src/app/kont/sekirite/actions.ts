"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { z } from "zod";
export type MFAState = {
  error?: string;
  message?: string;
  factorId?: string;
  qr?: string;
};
export async function enrollMfa(): Promise<MFAState> {
  const { supabase } = await requireUser();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  if (factors?.totp.some((f) => f.status === "verified"))
    return { message: "Kont ou deja gen yon aplikasyon otantifikasyon." };
  for (const factor of factors?.all ?? [])
    if (factor.status === "unverified")
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "TEKTALKKREYÒL ACADEMY",
  });
  if (error)
    return { error: "Nou pa rive prepare verifikasyon an. Eseye ankò." };
  return { factorId: data.id, qr: data.totp.qr_code };
}
export async function verifyMfa(
  _state: MFAState,
  form: FormData,
): Promise<MFAState> {
  const parsed = z
    .object({ factorId: z.uuid(), code: z.string().regex(/^\d{6}$/) })
    .safeParse({ factorId: form.get("factorId"), code: form.get("code") });
  if (!parsed.success) return { error: "Antre kòd 6 chif aplikasyon ou an." };
  const { supabase } = await requireUser();
  const { error } = await supabase.auth.mfa.challengeAndVerify(parsed.data);
  if (error)
    return { error: "Kòd la pa valab oswa li ekspire. Eseye yon nouvo kòd." };
  revalidatePath("/kont/sekirite");
  return {
    message: "Verifikasyon an reyisi. Kont ou pwoteje ak dezyèm etap la.",
  };
}
