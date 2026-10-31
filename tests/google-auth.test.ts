import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn(),
  signIn: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
import { signInWithGoogle } from "@/app/auth/google/actions";
import { getAuthSiteOrigin, safeNext, getSupabaseConfig } from "@/lib/config";
import {
  classifySupabaseKey,
  findSecretKinds,
} from "../scripts/security-lib.mjs";
beforeEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
  vi.stubEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "sb_publishable_" + "demo".repeat(8),
  );
  vi.stubEnv("SITE_URL", "https://academy.example");
  mocks.createClient.mockResolvedValue({
    auth: { signInWithOAuth: mocks.signIn },
  });
  mocks.signIn.mockResolvedValue({
    data: {
      url: "https://project.supabase.co/auth/v1/authorize?provider=google",
    },
    error: null,
  });
  mocks.redirect.mockImplementation((url) => {
    throw new Error(`REDIRECT ${url}`);
  });
});
const consent = () => {
  const form = new FormData();
  form.set("acceptTerms", "on");
  return form;
};
describe("Google OAuth", () => {
  it.each(["signup", "login"] as const)(
    "requires terms before %s, including auto-created Google accounts",
    async (mode) => {
      expect(await signInWithGoogle(mode, {}, new FormData())).toHaveProperty(
        "error",
      );
      expect(mocks.signIn).not.toHaveBeenCalled();
    },
  );
  it("starts a PKCE-capable server flow with minimal scopes and an owned callback", async () => {
    await expect(signInWithGoogle("signup", {}, consent())).rejects.toThrow(
      "REDIRECT https://project.supabase.co/auth/v1/authorize",
    );
    expect(mocks.signIn).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "https://academy.example/auth/confirm",
        scopes: "email profile",
        skipBrowserRedirect: true,
        queryParams: { prompt: "select_account" },
      },
    });
  });
  it("handles provider failure without leaking provider details", async () => {
    mocks.signIn.mockResolvedValue({
      data: { url: null },
      error: { message: "sensitive provider diagnostic" },
    });
    const result = await signInWithGoogle("login", {}, consent());
    expect(result.error).toBeTruthy();
    expect(JSON.stringify(result)).not.toContain("sensitive");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
  it.each([
    "https://evil.example/",
    "https://project.supabase.co/other",
    "https://user@project.supabase.co/auth/v1/authorize",
  ])("rejects unexpected OAuth destinations %s", async (url) => {
    mocks.signIn.mockResolvedValue({ data: { url }, error: null });
    expect(await signInWithGoogle("login", {}, consent())).toHaveProperty(
      "error",
    );
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
  it("fails closed when site configuration is unavailable", async () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL", "");
    expect(await signInWithGoogle("signup", {}, consent())).toHaveProperty(
      "error",
    );
    expect(mocks.signIn).not.toHaveBeenCalled();
  });
});
describe("trusted callback origins", () => {
  it("allows HTTPS deployment configuration", () =>
    expect(getAuthSiteOrigin({ SITE_URL: "https://academy.example/" })).toBe(
      "https://academy.example",
    ));
  it("rejects userinfo and non-origin URLs", () => {
    for (const SITE_URL of [
      "https://user:password@academy.example",
      "https://academy.example/extra",
      "https://academy.example/?redirect=bad",
      "http://academy.example",
      "javascript:alert(1)",
    ])
      expect(getAuthSiteOrigin({ SITE_URL })).toBeNull();
  });
  it("replaces a stale localhost URL on Vercel with the deployment-owned production hostname", () => {
    expect(
      getAuthSiteOrigin({
        VERCEL: "1",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        VERCEL_PROJECT_PRODUCTION_URL: "academy.vercel.app",
      }),
    ).toBe("https://academy.vercel.app");
    expect(
      getAuthSiteOrigin({
        VERCEL: "1",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      }),
    ).toBeNull();
  });
  it.each([
    "/%2f%2fevil.example",
    "/%5cevil.example",
    "/%255cevil.example",
    "/%0d%0aevil",
    "/bad%",
    "//evil.example",
  ])("rejects encoded redirect attacks %s", (value) =>
    expect(safeNext(value)).toBe("/tablo-bod"),
  );
});
describe("public key boundaries", () => {
  const jwt = (role: string) =>
    btoa(JSON.stringify({ alg: "HS256" })).replace(/=/g, "") +
    "." +
    btoa(JSON.stringify({ role })).replace(/=/g, "") +
    ".signature";
  it("allows only publishable and legacy anon keys", () => {
    expect(classifySupabaseKey("sb_publishable_" + "demo".repeat(6))).toBe(
      "public",
    );
    expect(classifySupabaseKey(jwt("anon"))).toBe("public");
    expect(classifySupabaseKey(jwt("service_role"))).toBe("privileged");
    expect(classifySupabaseKey("sb_secret_" + "demo".repeat(6))).toBe(
      "privileged",
    );
    expect(classifySupabaseKey("arbitrary credential")).toBe("invalid");
  });
  it("refuses a privileged key at runtime", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", jwt("service_role"));
    expect(getSupabaseConfig()).toBeNull();
  });
  it("identifies privileged content without returning matched values", () => {
    const secret = "sb_secret_" + "demo".repeat(8);
    const kinds = findSecretKinds(secret + " " + jwt("service_role"));
    expect(kinds).toContain("Supabase secret key");
    expect(kinds).toContain("Supabase service_role JWT");
    expect(JSON.stringify(kinds)).not.toContain(secret);
    expect(findSecretKinds(jwt("anon"))).toEqual([]);
  });
});

it("rejects credentials embedded in a public project URL", () => {
  vi.stubEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    "https://user:password@project.supabase.co",
  );
  expect(getSupabaseConfig()).toBeNull();
});
