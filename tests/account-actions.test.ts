import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({
  client: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  reset: vi.fn(),
  resend: vi.fn(),
  user: vi.fn(),
  update: vi.fn(),
  logout: vi.fn(),
  redirect: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: m.client }));
vi.mock("next/navigation", () => ({ redirect: m.redirect }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidate }));
import {
  authenticate,
  resendConfirmation,
  signOut,
  updatePassword,
} from "@/app/auth/actions";
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("SITE_URL", "https://academy.example");
  m.client.mockResolvedValue({
    auth: {
      signInWithPassword: m.login,
      signUp: m.signup,
      resetPasswordForEmail: m.reset,
      resend: m.resend,
      getUser: m.user,
      updateUser: m.update,
      signOut: m.logout,
    },
  });
  m.redirect.mockImplementation((url) => {
    throw new Error("REDIRECT " + url);
  });
  m.reset.mockResolvedValue({ error: null });
  m.resend.mockResolvedValue({ error: null });
  m.logout.mockResolvedValue({ error: null });
});
function form(values: Record<string, string>) {
  const f = new FormData();
  Object.entries(values).forEach(([k, v]) => f.set(k, v));
  return f;
}
const signup = () =>
  form({
    email: " learner@example.test ",
    password: "new-secure-password",
    displayName: "Elèv",
    acceptTerms: "on",
  });
it("rejects malformed inputs before contacting Auth", async () => {
  expect(
    await authenticate("signup", {}, form({ email: "bad" })),
  ).toHaveProperty("error");
  expect(m.signup).not.toHaveBeenCalled();
});
it("keeps terms mandatory server-side", async () => {
  const f = signup();
  f.delete("acceptTerms");
  expect(await authenticate("signup", {}, f)).toHaveProperty("error");
  expect(m.signup).not.toHaveBeenCalled();
});
it("creates an unconfirmed account with the owned callback and normalized email", async () => {
  m.signup.mockResolvedValue({ data: { session: null }, error: null });
  expect(await authenticate("signup", {}, signup())).toHaveProperty(
    "confirmationRequired",
    true,
  );
  expect(m.signup).toHaveBeenCalledWith({
    email: "learner@example.test",
    password: "new-secure-password",
    options: {
      data: { display_name: "Elèv" },
      emailRedirectTo: "https://academy.example/auth/confirm",
    },
  });
});
it("enters the dashboard immediately when the provider already returned a session", async () => {
  m.signup.mockResolvedValue({
    data: { session: { access_token: "test-session" } },
    error: null,
  });
  await expect(authenticate("signup", {}, signup())).rejects.toThrow(
    "REDIRECT /tablo-bod",
  );
});
it("allows login with an existing password shorter than the signup policy", async () => {
  m.login.mockResolvedValue({
    data: { session: { access_token: "test-session" } },
    error: null,
  });
  await expect(
    authenticate(
      "login",
      {},
      form({ email: "learner@example.test", password: "oldpass" }),
    ),
  ).rejects.toThrow("REDIRECT /tablo-bod");
});
it("preserves safe private return paths", async () => {
  m.login.mockResolvedValue({ data: { session: {} }, error: null });
  await expect(
    authenticate(
      "login",
      {},
      form({
        email: "learner@example.test",
        password: "oldpass",
        next: "/kont/modpas",
      }),
    ),
  ).rejects.toThrow("REDIRECT /kont/modpas");
});
it("blocks an external return path after login", async () => {
  m.login.mockResolvedValue({ data: { session: {} }, error: null });
  await expect(
    authenticate(
      "login",
      {},
      form({
        email: "learner@example.test",
        password: "oldpass",
        next: "//evil.test",
      }),
    ),
  ).rejects.toThrow("REDIRECT /tablo-bod");
});
it("offers email confirmation without echoing provider diagnostics", async () => {
  m.login.mockResolvedValue({
    error: { code: "email_not_confirmed", message: "provider diagnostic" },
  });
  const result = await authenticate(
    "login",
    {},
    form({ email: "learner@example.test", password: "oldpass" }),
  );
  expect(result.confirmationRequired).toBe(true);
  expect(JSON.stringify(result)).not.toContain("provider diagnostic");
});
it("does not admit an account without a session", async () => {
  m.login.mockResolvedValue({ data: { session: null }, error: null });
  expect(
    await authenticate(
      "login",
      {},
      form({ email: "learner@example.test", password: "oldpass" }),
    ),
  ).toHaveProperty("error");
  expect(m.redirect).not.toHaveBeenCalled();
});
it("sends a recovery email with the password page as return path", async () => {
  expect(
    await authenticate("reset", {}, form({ email: "learner@example.test" })),
  ).toHaveProperty("message");
  expect(m.reset).toHaveBeenCalledWith("learner@example.test", {
    redirectTo: "https://academy.example/auth/confirm?next=/kont/modpas",
  });
});
it.each([
  { status: 429, code: "over_email_send_rate_limit" },
  { status: 500, code: "unexpected_failure" },
])(
  "does not pretend a failed recovery request succeeded: %s",
  async (error) => {
    m.reset.mockResolvedValue({ error });
    const result = await authenticate(
      "reset",
      {},
      form({ email: "learner@example.test" }),
    );
    expect(result.error).toBeTruthy();
    expect(result.message).toBeUndefined();
  },
);
it("recovers cleanly from an Auth transport failure", async () => {
  m.reset.mockRejectedValue(new Error("private transport details"));
  const result = await authenticate(
    "reset",
    {},
    form({ email: "learner@example.test" }),
  );
  expect(result.error).toBeTruthy();
  expect(JSON.stringify(result)).not.toContain("private transport");
});
it("resends confirmation without revealing whether an address exists", async () => {
  const result = await resendConfirmation(
    {},
    form({ email: "learner@example.test" }),
  );
  expect(result.message).toContain("Si kont sa a");
  expect(m.resend).toHaveBeenCalledWith({
    type: "signup",
    email: "learner@example.test",
    options: { emailRedirectTo: "https://academy.example/auth/confirm" },
  });
});
it("refuses different new password confirmations", async () => {
  expect(
    await updatePassword(
      {},
      form({ password: "a-new-password", confirmPassword: "other-password" }),
    ),
  ).toHaveProperty("error");
  expect(m.update).not.toHaveBeenCalled();
});
it("requires a valid authenticated user before changing a password", async () => {
  m.user.mockResolvedValue({ data: { user: null }, error: null });
  expect(
    await updatePassword(
      {},
      form({ password: "a-new-password", confirmPassword: "a-new-password" }),
    ),
  ).toHaveProperty("error");
  expect(m.update).not.toHaveBeenCalled();
});
it("updates the password and exposes a success state", async () => {
  m.user.mockResolvedValue({
    data: { user: { id: "test-user" } },
    error: null,
  });
  m.update.mockResolvedValue({ error: null });
  expect(
    await updatePassword(
      {},
      form({ password: "a-new-password", confirmPassword: "a-new-password" }),
    ),
  ).toMatchObject({ success: true });
});
it("does not pretend signout succeeded if the provider refused", async () => {
  m.logout.mockResolvedValue({ error: { message: "failed" } });
  await expect(signOut()).rejects.toThrow(
    "REDIRECT /tablo-bod?eta=dekoneksyon",
  );
});
it("signs out the current session and clears cached account UI", async () => {
  await expect(signOut()).rejects.toThrow("REDIRECT /konekte?eta=dekonekte");
  expect(m.logout).toHaveBeenCalledWith({ scope: "local" });
  expect(m.revalidate).toHaveBeenCalled();
});
