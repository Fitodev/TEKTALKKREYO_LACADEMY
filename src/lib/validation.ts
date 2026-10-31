import { z } from "zod";
const email = z
  .string()
  .trim()
  .email("Antre yon adrès imèl ki valab.")
  .max(254);
export const credentialsSchema = z.object({
  email,
  password: z
    .string()
    .min(12, "Modpas la dwe gen omwen 12 karaktè.")
    .max(128, "Modpas la twò long."),
});
// Existing accounts may predate the current password creation policy.
export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(1, "Antre modpas ou.")
    .max(128, "Modpas la twò long."),
});
export const signupSchema = credentialsSchema.extend({
  displayName: z.string().trim().min(2, "Antre non ou.").max(80),
  acceptTerms: z.literal(true, { error: "Ou dwe aksepte kondisyon yo." }),
});
export const emailSchema = z.object({ email });
export const passwordUpdateSchema = z
  .object({
    password: credentialsSchema.shape.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "De modpas yo dwe menm.",
  });
export const httpsUrl = z.url().refine((value) => {
  const u = new URL(value);
  return u.protocol === "https:" && !u.username && !u.password;
}, "Lyen an dwe itilize HTTPS san enfòmasyon koneksyon.");
