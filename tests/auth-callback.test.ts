import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  exchange: vi.fn(),
  verifyOtp: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
import { GET } from "@/app/auth/confirm/route";
beforeEach(() => {
  vi.resetAllMocks();
  mocks.createClient.mockResolvedValue({
    auth: {
      exchangeCodeForSession: mocks.exchange,
      verifyOtp: mocks.verifyOtp,
    },
  });
  mocks.exchange.mockResolvedValue({ error: null });
});
it("exchanges the PKCE code and strips credentials from the destination", async () => {
  const result = await GET(
    new NextRequest(
      "https://academy.example/auth/confirm?code=one-time-code&next=/tablo-bod",
    ),
  );
  expect(mocks.exchange).toHaveBeenCalledWith("one-time-code");
  expect(result.headers.get("location")).toBe("/tablo-bod");
  expect(result.headers.get("cache-control")).toBe("private, no-store");
  expect(result.headers.get("referrer-policy")).toBe("no-referrer");
});
it("ignores reflected provider error descriptions", async () => {
  const result = await GET(
    new NextRequest(
      "https://academy.example/auth/confirm?error=access_denied&error_description=untrusted",
    ),
  );
  expect(result.headers.get("location")).toBe("/konekte?eta=google");
  expect(mocks.exchange).not.toHaveBeenCalled();
});
it("does not allow a successful code exchange to become an open redirect", async () => {
  const result = await GET(
    new NextRequest(
      "https://academy.example/auth/confirm?code=one-time-code&next=//evil.example",
    ),
  );
  expect(result.headers.get("location")).toBe("/tablo-bod");
});
it("does not grant a session when code exchange fails", async () => {
  mocks.exchange.mockResolvedValue({ error: { message: "bad verifier" } });
  const result = await GET(
    new NextRequest("https://academy.example/auth/confirm?code=wrong"),
  );
  expect(result.headers.get("location")).toBe("/konekte?eta=lyen");
});

it("uses the password page for PKCE recovery even without a next parameter", async () => {
  mocks.exchange.mockResolvedValue({
    data: { redirectType: "recovery" },
    error: null,
  });
  const result = await GET(
    new NextRequest("https://academy.example/auth/confirm?code=recovery-code"),
  );
  expect(result.headers.get("location")).toBe("/kont/modpas");
});
it("uses the password page for recovery token hashes from email templates", async () => {
  mocks.verifyOtp.mockResolvedValue({ data: { user: {} }, error: null });
  const result = await GET(
    new NextRequest(
      "https://academy.example/auth/confirm?token_hash=recovery-hash&type=recovery",
    ),
  );
  expect(result.headers.get("location")).toBe("/kont/modpas");
  expect(mocks.verifyOtp).toHaveBeenCalledWith({
    token_hash: "recovery-hash",
    type: "recovery",
  });
});

it.each([
  "error=access_denied&error_code=otp_expired",
  "error=access_denied&type=recovery",
  "error=access_denied&next=/kont/modpas",
])(
  "labels email recovery failures as invalid links, not Google failures: %s",
  async (query) => {
    const result = await GET(
      new NextRequest("https://academy.example/auth/confirm?" + query),
    );
    expect(result.headers.get("location")).toBe("/konekte?eta=lyen");
    expect(mocks.exchange).not.toHaveBeenCalled();
  },
);
