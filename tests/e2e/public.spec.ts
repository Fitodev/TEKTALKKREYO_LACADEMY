import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home, catalogue and complete curriculum", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Aprann teknoloji",
  );
  await page.getByRole("link", { name: "Gade kou yo", exact: true }).click();
  await page.getByRole("link", { name: /Gade detay pwogram/ }).click();
  await expect(page.locator("details")).toHaveCount(10);
  await page.locator("summary").first().click();
  await expect(page.getByText("Kisa Google Workspace ye?")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("public pages meet automated accessibility checks", async ({ page }) => {
  for (const path of [
    "/",
    "/kou",
    "/konekte",
    "/enskri",
    "/kou/workspace-ia-automatisation",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
test("private pages require authentication", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/konekte/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Kont ou, chemen ou.",
  );
});

test("public information pages and unknown routes return correct status", async ({
  request,
}) => {
  for (const path of [
    "/sou-nou",
    "/zouti",
    "/kontak",
    "/konfidansyalite",
    "/kondisyon",
    "/afilyasyon",
    "/bliye-modpas",
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('lang="ht"');
  }
  expect((await request.get("/kou/does-not-exist")).status()).toBe(404);
});

test("small screens keep content readable and unconfigured accounts are explicit", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/enskri");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByText(/Sèvis kont lan poko disponib/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kreye kont mwen" }),
  ).toBeDisabled();
});
