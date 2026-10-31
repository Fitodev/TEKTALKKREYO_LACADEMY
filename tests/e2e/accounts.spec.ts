import { test, expect, type APIRequestContext } from "@playwright/test";
import { randomBytes } from "node:crypto";
test.skip(
  process.env.AUTH_INTEGRATION !== "1",
  "Opt-in suite requires local Supabase Auth and mail only.",
);
test("create, confirm, sign in, recover, change password and enforce private access", async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  const mail = process.env.AUTH_TEST_MAIL_URL!;
  expect(["127.0.0.1", "localhost"]).toContain(new URL(mail).hostname);
  const email = `academy-${randomBytes(8).toString("hex")}@example.test`;
  const original = randomBytes(20).toString("base64url");
  const replacement = randomBytes(20).toString("base64url");
  async function emailLink(request: APIRequestContext, subject: string) {
    let link = "";
    await expect
      .poll(
        async () => {
          const response = await request.get(
            new URL("/api/v1/messages", mail).href,
          );
          if (!response.ok()) return false;
          const data = await response.json();
          const message = (data.messages ?? []).find(
            (m: { ID: string; To: { Address: string }[]; Subject: string }) =>
              m.To.some((t) => t.Address === email) &&
              m.Subject.toLowerCase().includes(subject),
          );
          if (!message) return false;
          const details = await (
            await request.get(
              new URL(`/api/v1/message/${message.ID}`, mail).href,
            )
          ).json();
          const html = details.HTML ?? "";
          const found = html.match(/href="([^"]*\/auth\/v1\/verify[^\"]*)"/);
          if (!found) return false;
          link = found[1].replaceAll("&amp;", "&");
          return true;
        },
        {
          timeout: 20000,
          message: "Local Auth email should arrive in the isolated mailbox",
        },
      )
      .toBe(true);
    // Never navigate to an email-provided external host during this test.
    expect(["127.0.0.1", "localhost"]).toContain(new URL(link).hostname);
    return link;
  }
  const emailForm = () => page.getByRole("form", { name: "Kont avèk imèl" });
  await page.goto("/tablo-bod");
  await expect(page).toHaveURL(/konekte/);
  await page.goto("/enskri");
  await emailForm().getByLabel("Non ou", { exact: true }).fill("Elèv Tès");
  await emailForm().getByLabel("Adrès imèl", { exact: true }).fill(email);
  await emailForm().getByLabel("Modpas", { exact: true }).fill(original);
  await emailForm().getByRole("checkbox").check();
  await emailForm().getByRole("button", { name: "Kreye kont mwen" }).click();
  await expect(emailForm().getByRole("status")).toContainText("konfime");
  const confirmation = await emailLink(request, "confirm");
  await page.goto("/konekte");
  await emailForm().getByLabel("Adrès imèl", { exact: true }).fill(email);
  await emailForm().getByLabel("Modpas", { exact: true }).fill(original);
  await emailForm()
    .getByRole("button", { name: "Konekte", exact: true })
    .click();
  await expect(emailForm().getByRole("alert")).toContainText("konfime");
  await page.goto(confirmation);
  await expect(page).toHaveURL(/tablo-bod/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Elèv Tès",
  );
  await page.goto("/admin");
  await expect(page).toHaveURL(/tablo-bod/);
  await page.getByRole("button", { name: "Dekonekte", exact: true }).click();
  await expect(page).toHaveURL(/konekte/);
  await page.goto("/tablo-bod");
  await expect(page).toHaveURL(/konekte/);
  await emailForm().getByLabel("Adrès imèl", { exact: true }).fill(email);
  await emailForm().getByLabel("Modpas", { exact: true }).fill(original);
  await emailForm()
    .getByRole("button", { name: "Konekte", exact: true })
    .click();
  await expect(page).toHaveURL(/tablo-bod/);
  await page.getByRole("button", { name: "Dekonekte", exact: true }).click();
  await page.goto("/bliye-modpas");
  await emailForm().getByLabel("Adrès imèl", { exact: true }).fill(email);
  await emailForm().getByRole("button", { name: "Voye lyen an" }).click();
  await expect(emailForm().getByRole("status")).toContainText("chanje modpas");
  const recovery = await emailLink(request, "reset");
  await page.goto(recovery);
  await expect(page).toHaveURL(/kont\/modpas/);
  await page.getByLabel("Nouvo modpas", { exact: true }).fill(replacement);
  await page
    .getByLabel("Konfime nouvo modpas la", { exact: true })
    .fill(original);
  await page.getByRole("button", { name: "Sove modpas la" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("menm");
  await page
    .getByLabel("Konfime nouvo modpas la", { exact: true })
    .fill(replacement);
  await page.getByRole("button", { name: "Sove modpas la" }).click();
  await expect(page.getByRole("main").getByRole("status")).toContainText(
    "Modpas ou chanje",
  );
  await page.getByRole("link", { name: "Ale nan espas mwen" }).click();
  await expect(page).toHaveURL(/tablo-bod/);
  await page.getByRole("button", { name: "Dekonekte", exact: true }).click();
  await emailForm().getByLabel("Adrès imèl", { exact: true }).fill(email);
  await emailForm().getByLabel("Modpas", { exact: true }).fill(original);
  await emailForm()
    .getByRole("button", { name: "Konekte", exact: true })
    .click();
  await expect(emailForm().getByRole("alert")).toBeVisible();
  await emailForm().getByLabel("Modpas", { exact: true }).fill(replacement);
  await emailForm()
    .getByRole("button", { name: "Konekte", exact: true })
    .click();
  await expect(page).toHaveURL(/tablo-bod/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Elèv Tès",
  );
});
