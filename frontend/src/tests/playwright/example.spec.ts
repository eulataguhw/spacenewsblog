import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SpaceBlog/);
});

test("loads feed", async ({ page }) => {
  await page.goto("/");

  // Check if SearchBar is visible
  await expect(page.getByPlaceholderText(/Search articles.../i)).toBeVisible();
});
