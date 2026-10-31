/** Classification only: this does not verify a JWT signature. Never return key material. */
export function classifySupabaseKey(value) {
  if (typeof value !== "string" || !value) return "missing";
  if (/^sb_secret_/.test(value)) return "privileged";
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(value)) return "public";
  const parts = value.split(".");
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      if (payload.role === "service_role") return "privileged";
      if (payload.role === "anon") return "public";
    } catch {
      /* Invalid keys fail closed. */
    }
  }
  return "invalid";
}

export function findSecretKinds(text) {
  const kinds = new Set();
  const patterns = [
    ["Supabase secret key", /\bsb_secret_[A-Za-z0-9_-]{12,}/],
    [
      "GitHub access token",
      /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/,
    ],
    ["Google OAuth client secret", /\bGOCSPX-[A-Za-z0-9_-]{16,}/],
    ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ];
  for (const [kind, pattern] of patterns)
    if (pattern.test(text)) kinds.add(kind);
  for (const jwt of text.matchAll(
    /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  )) {
    if (classifySupabaseKey(jwt[0]) === "privileged")
      kinds.add("Supabase service_role JWT");
  }
  return [...kinds];
}
