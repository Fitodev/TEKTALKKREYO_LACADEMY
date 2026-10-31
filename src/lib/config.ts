import { classifySupabaseKey } from "../../scripts/security-lib.mjs";
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || classifySupabaseKey(key) !== "public") return null;
  try {
    const parsed = new URL(url);
    if (parsed.username || parsed.password || parsed.search || parsed.hash)
      return null;
    if (
      parsed.protocol !== "https:" &&
      !(
        parsed.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(parsed.hostname)
      )
    )
      return null;
  } catch {
    return null;
  }
  return { url, key };
}
/** Resolve only deployment-owned configuration, never an incoming Host header. */
export function getAuthSiteOrigin(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const configured = env.SITE_URL || env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      const url = new URL(configured);
      const local = ["localhost", "127.0.0.1"].includes(url.hostname);
      if (
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
      )
        return null;
      if (!local && url.protocol === "https:") return url.origin;
      if (local && !env.VERCEL && ["http:", "https:"].includes(url.protocol))
        return url.origin;
    } catch {
      return null;
    }
  }
  const host = env.VERCEL_PROJECT_PRODUCTION_URL;
  if (
    env.VERCEL &&
    host &&
    /^[a-z0-9]+(?:[a-z0-9.-]*[a-z0-9])?\.vercel\.app$/i.test(host)
  )
    return `https://${host.toLowerCase()}`;
  return null;
}

export function safeNext(value: string | null): string {
  if (!value) return "/tablo-bod";
  let decoded = value;
  try {
    for (let pass = 0; pass < 3; pass++) {
      if (
        !decoded.startsWith("/") ||
        decoded.startsWith("//") ||
        /[\\\u0000-\u0020\u007f]/.test(decoded)
      )
        return "/tablo-bod";
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    const url = new URL(decoded, "https://academy.invalid");
    return url.origin === "https://academy.invalid" ? value : "/tablo-bod";
  } catch {
    return "/tablo-bod";
  }
}
