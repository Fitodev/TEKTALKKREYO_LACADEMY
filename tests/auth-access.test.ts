import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({
  client: vi.fn(),
  getUser: vi.fn(),
  redirect: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: m.client }));
vi.mock("next/navigation", () => ({ redirect: m.redirect }));
import { requireUser } from "@/lib/auth";
beforeEach(() => {
  vi.resetAllMocks();
  m.client.mockResolvedValue({ auth: { getUser: m.getUser } });
  m.redirect.mockImplementation((url) => {
    throw new Error("REDIRECT " + url);
  });
});
it("keeps the requested password page across a required login", async () => {
  m.getUser.mockResolvedValue({ data: { user: null }, error: null });
  await expect(requireUser("/kont/modpas")).rejects.toThrow(
    "REDIRECT /konekte?next=%2Fkont%2Fmodpas",
  );
});
it("does not admit a missing session", async () => {
  m.getUser.mockResolvedValue({ data: { user: null }, error: null });
  await expect(requireUser()).rejects.toThrow("REDIRECT /konekte");
});
it("never turns a return path into an external login redirect", async () => {
  m.getUser.mockResolvedValue({ data: { user: null }, error: null });
  await expect(requireUser("//evil.test")).rejects.toThrow(
    "REDIRECT /konekte?next=%2Ftablo-bod",
  );
});
it("preserves the return page when the service is unconfigured", async () => {
  m.client.mockResolvedValue(null);
  await expect(requireUser("/kont/modpas")).rejects.toThrow(
    "REDIRECT /konekte?eta=konfigirasyon&next=%2Fkont%2Fmodpas",
  );
});
it("permits a verified user", async () => {
  m.getUser.mockResolvedValue({
    data: { user: { id: "verified-test-user" } },
    error: null,
  });
  expect((await requireUser("/kont/modpas")).user.id).toBe(
    "verified-test-user",
  );
  expect(m.redirect).not.toHaveBeenCalled();
});
