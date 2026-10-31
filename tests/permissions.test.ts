import { describe, it, expect } from "vitest";
import { can } from "@/lib/permissions";
import { safeNext } from "@/lib/config";
import { signupSchema, httpsUrl } from "@/lib/validation";
import { curriculum } from "@/lib/curriculum";
describe("authorization", () => {
  it("denies unknown roles", () => {
    expect(can(null, "edit")).toBe(false);
    expect(can("owner", "learn")).toBe(false);
  });
  it("requires MFA for all administrative capabilities", () => {
    expect(can("admin", "edit", "aal1")).toBe(false);
    expect(can("admin", "publish", "aal2")).toBe(true);
  });
  it("does not let editors publish or manage users", () => {
    expect(can("editor", "edit")).toBe(true);
    expect(can("editor", "publish", "aal2")).toBe(false);
    expect(can("student", "edit", "aal2")).toBe(false);
  });
});
describe("redirects", () => {
  it.each([
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/ok\nLocation: evil",
    null,
  ])("rejects unsafe target %s", (v) => expect(safeNext(v)).toBe("/tablo-bod"));
  it("allows local paths", () =>
    expect(safeNext("/kont/sekirite")).toBe("/kont/sekirite"));
});
it("requires explicit terms and a strong password", () => {
  expect(
    signupSchema.safeParse({
      email: "e@example.com",
      password: "short",
      displayName: "Jean",
      acceptTerms: true,
    }).success,
  ).toBe(false);
  expect(
    signupSchema.safeParse({
      email: "e@example.com",
      password: "a-strong-password",
      displayName: "Jean",
      acceptTerms: false,
    }).success,
  ).toBe(false);
});
it("rejects insecure and credential-bearing links", () => {
  expect(httpsUrl.safeParse("javascript:alert(1)").success).toBe(false);
  expect(httpsUrl.safeParse("https://user:pass@example.com").success).toBe(
    false,
  );
});
it("preserves exactly ten modules and forty unique draft lessons", () => {
  expect(curriculum).toHaveLength(10);
  expect(curriculum.every((m) => m.lessons.length === 4)).toBe(true);
  expect(
    new Set(curriculum.flatMap((m) => m.lessons.map((l) => l.slug))).size,
  ).toBe(40);
});
