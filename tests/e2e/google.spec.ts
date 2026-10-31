import { test, expect } from "@playwright/test";
const project = process.env.NEXT_PUBLIC_SUPABASE_URL;
// No real Google account or credentials are used: intercept only the outgoing authorization navigation.
test("Google sign-up generates PKCE and protects the verifier cookie", async ({
  page,
  context,
}) => {
  test.skip(
    !project,
    "Requires the public Supabase configuration used for this build.",
  );
  const authorize = new URL("/auth/v1/authorize", project!).href;
  await page.route(authorize + "**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html lang='en'><head><title>OAuth test boundary</title></head><body>Authorization navigation intercepted for testing.</body></html>",
    }),
  );
  await page.goto("/enskri");
  const form = page.getByRole("form", { name: "Koneksyon avèk Google" });
  await expect(form.getByRole("button")).toBeEnabled();
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Kontinye avèk Google" }).click();
  await page.waitForURL(authorize + "**");
  const url = new URL(page.url());
  expect(url.searchParams.get("provider")).toBe("google");
  expect(url.searchParams.get("code_challenge_method")).toBe("s256");
  expect(url.searchParams.get("code_challenge")).toBeTruthy();
  expect(url.searchParams.get("redirect_to")).toMatch(
    /^https?:\/\/(localhost|127\.0\.0\.1):3000\/auth\/confirm$/,
  );
  expect(url.searchParams.get("scopes")).toBe("email profile");
  const verifier = (await context.cookies("http://127.0.0.1:3000")).filter(
    (c) => c.name.includes("code-verifier"),
  );
  expect(verifier.length).toBeGreaterThan(0);
  for (const cookie of verifier) {
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe("Lax");
    expect(cookie.secure).toBe(true);
  }
});
