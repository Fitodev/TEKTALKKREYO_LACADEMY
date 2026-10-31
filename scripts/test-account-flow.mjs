import { execFileSync, spawnSync } from "node:child_process";
let config;
try {
  config = JSON.parse(
    execFileSync("node_modules/.bin/supabase", ["status", "-o", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
} catch {
  console.error(
    "Start local Supabase before running the account integration suite. Configuration values withheld.",
  );
  process.exit(1);
}
const url = config.API_URL,
  mail = config.MAILPIT_URL || config.INBUCKET_URL;
for (const value of [url, mail]) {
  try {
    if (!["127.0.0.1", "localhost"].includes(new URL(value).hostname))
      throw new Error();
  } catch {
    console.error(
      "Refusing to run account creation tests against a non-local service.",
    );
    process.exit(1);
  }
}
const key = config.PUBLISHABLE_KEY || config.ANON_KEY;
if (!key) {
  console.error("Local public Auth key is unavailable.");
  process.exit(1);
}
const env = {
  ...process.env,
  AUTH_INTEGRATION: "1",
  AUTH_TEST_MAIL_URL: mail,
  SUPABASE_URL: url,
  SUPABASE_PUBLISHABLE_KEY: key,
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
  SITE_URL: "http://127.0.0.1:3000",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
  VERCEL: "",
};
for (const args of [
  ["run", "build"],
  [
    "exec",
    "--",
    "playwright",
    "test",
    "tests/e2e/accounts.spec.ts",
    "--project=chromium",
  ],
]) {
  const result = spawnSync("npm", args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
