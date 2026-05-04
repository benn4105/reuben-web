import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/", heading: /Simulate Before/i },
  { path: "/projects", heading: "Our Work" },
  { path: "/projects/reux", heading: "Reux Programming Language" },
  { path: "/projects/reux/roadmap", heading: "Reux Roadmap" },
  { path: "/projects/reux/demo", heading: /Try the Reux commerce console/i },
  { path: "/docs", heading: "Getting Started with Reux" },
  { path: "/simulator", heading: "Business Simulator" },
];

test.describe("public frontend smoke", () => {
  for (const pageConfig of publicPages) {
    test(`${pageConfig.path} renders polished public content`, async ({ page }) => {
      await page.goto(pageConfig.path);

      await expect(page.getByRole("heading", { name: pageConfig.heading }).first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText("NEXT_PUBLIC_REUX_DEMO_URL");
      await expect(page.locator("body")).not.toContainText("\u00e2");
    });
  }

  test("demo fallback keeps visitors moving when the hosted console is not configured", async ({ page }) => {
    await page.goto("/projects/reux/demo");

    await expect(page.getByRole("heading", { name: "The hosted console is being refreshed." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Try Business Simulator" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Developer Preview" }).first()).toBeVisible();
  });
});
