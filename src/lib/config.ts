export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
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
export function safeNext(value: string | null): string {
  return value && /^\/(?![\/\\])/.test(value) && !/[\\\r\n]/.test(value)
    ? value
    : "/tablo-bod";
}
