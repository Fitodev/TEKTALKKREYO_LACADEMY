import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { classifySupabaseKey, findSecretKinds } from "./security-lib.mjs";
const production = process.argv.includes("--production");
loadEnvConfig(process.cwd(), !production);
const errors = [];
for (const [name, value] of Object.entries(process.env)) {
  if (!name.startsWith("NEXT_PUBLIC_")) continue;
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.username || url.password) errors.push(name);
    } catch {
      errors.push(name);
    }
  }
  if (
    /(?:SECRET|TOKEN|PASSWORD|PRIVATE|SERVICE_ROLE|CREDENTIAL)/.test(name) ||
    findSecretKinds(value ?? "").length
  )
    errors.push(name);
}
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (key && classifySupabaseKey(key) !== "public")
  errors.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
if (errors.length) {
  console.error(
    "Build blocked: unsafe public environment variables (values withheld):",
    [...new Set(errors)].join(", "),
  );
  process.exit(1);
}
console.log(
  "Public environment key check passed. Publishable/anon Supabase keys may be public; privileged keys may not.",
);
