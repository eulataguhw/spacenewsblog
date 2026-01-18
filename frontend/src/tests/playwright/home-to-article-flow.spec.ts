import { test, expect } from "@playwright/test";

test.describe("Home to Article Detail Flow", () => {
  test("should complete full user journey with comment submission and metrics verification", async ({
    page,
  }) => {
    // Shared state variables
    let topArticleTitle: string | null = null;
    let topArticleCommentCount = 0;
    let topCommenterName: string | null = null;
    let topCommenterCommentCount = 0;
    let randomizedUsername = "";
    let commentText = "";

    await test.step("1. Load Home Page & Verify Title", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/SpaceBlog/i);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000);
    });

    await test.step("2. Verify Initial Engagement Metrics", async () => {
      const avgCommentsLocator = page
        .getByTestId("activity-metric-value")
        .first();
      await expect(avgCommentsLocator).toBeVisible({ timeout: 15000 });

      const avgCommentsText = await avgCommentsLocator.textContent();
      expect(Number.isNaN(Number.parseFloat(avgCommentsText || "0"))).toBe(
        false,
      );

      // Verify Top Article
      // Verify Top Article loop
      const topArticleItems = page.getByTestId("top-article-item");
      const count = await topArticleItems.count();

      for (let i = 0; i < count; i++) {
        const item = topArticleItems.nth(i);
        await expect(item).toBeVisible();

        const text = await item.getByTestId("article-title").textContent();
        if (text && !text.startsWith("Article #")) {
          topArticleTitle = text;
          const countText = await item
            .getByTestId("article-comment-count")
            .textContent();
          topArticleCommentCount = Number.parseInt(countText || "0", 10);
          break;
        }
      }

      if (!topArticleTitle) {
        // Fallback to first
        const first = topArticleItems.first();
        topArticleTitle = await first
          .getByTestId("article-title")
          .textContent();
      }

      // Verify Top Contributor
      const topContributorItem = page.getByTestId("contributor-item").first();
      await expect(topContributorItem).toBeVisible();

      topCommenterName = await topContributorItem
        .getByTestId("contributor-username")
        .textContent();
      const topCommenterCountText = await topContributorItem
        .getByTestId("contributor-comment-count")
        .textContent();
      topCommenterCommentCount = Number.parseInt(
        topCommenterCountText || "0",
        10,
      );
    });

    await test.step("3. Verify Theme Toggle", async () => {
      const themeToggle = page
        .locator('[aria-label*="theme" i], button:has-text("theme")')
        .first();
      await expect(themeToggle).toBeVisible();

      const initialBg = await page.evaluate(() => {
        return globalThis.getComputedStyle(document.body).backgroundColor;
      });

      await themeToggle.click();
      await page.waitForTimeout(500);

      const newBg = await page.evaluate(() => {
        return globalThis.getComputedStyle(document.body).backgroundColor;
      });

      expect(initialBg).not.toBe(newBg);
    });

    await test.step("4. Verify Article Feed & Filters", async () => {
      await page.waitForTimeout(1000);
      const articleCards = page.getByTestId("article-card");
      await expect(articleCards.first()).toBeVisible({ timeout: 15000 });
      const articleCount = await articleCards.count();
      expect(articleCount).toBeGreaterThan(0);

      // Test Date Filter
      const dateFilterStart = page.getByTestId("start-date-picker");
      const isDateFilterVisible = await dateFilterStart.isVisible();
      if (isDateFilterVisible) {
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 30);

        await dateFilterStart.fill(pastDate.toISOString().split("T")[0]);
        await page.waitForTimeout(1000);
      }

      // Test Sort
      const sortSelect = page.getByTestId("sort-select");
      const isSortSelectVisible = await sortSelect.isVisible();
      if (isSortSelectVisible) {
        await sortSelect.click();
        const sortOption = page
          .locator('[role="option"]')
          .filter({ hasText: /oldest|ascending/i })
          .first();
        if (await sortOption.isVisible()) {
          await sortOption.click();
          await page.waitForTimeout(1000);
        }
      }

      // Clear filters
      if (isDateFilterVisible) {
        await dateFilterStart.fill("");
        await page.waitForTimeout(1000);
      }
    });

    await test.step("5. Search & Navigate to Article", async () => {
      // Reload to clear all filters/inputs
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByTestId("search-input");
      await expect(searchInput).toBeVisible();

      const searchTerm =
        topArticleTitle?.split(" ").slice(0, 2).join(" ") || "Space";

      await searchInput.fill(searchTerm);
      await page.waitForTimeout(10000);

      const articleCards = page.getByTestId("article-card");
      let visibleArticles = await articleCards.count();

      if (visibleArticles === 0) {
        await searchInput.fill("Space");
        await page.waitForTimeout(10000);
      }

      // Find the article card that matches the title we want
      let targetArticle = articleCards.first(); // Default to first

      if (topArticleTitle) {
        const matchingArticle = articleCards
          .filter({ hasText: topArticleTitle })
          .first();
        if (await matchingArticle.isVisible()) {
          targetArticle = matchingArticle;
        }
      }

      await expect(targetArticle).toBeVisible();

      await targetArticle.click();

      await expect(page).toHaveURL(/\/articles\/\d+/);
    });

    await test.step("6. Submit Comment", async () => {
      const randomizeCase = (str: string) => {
        return str
          .split("")
          .map((char) =>
            Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase(),
          )
          .join("");
      };

      randomizedUsername = randomizeCase(topCommenterName || "PlaywrightUser");
      commentText = `Automated test comment ${Date.now()}`;

      const usernameInput = page.getByTestId("comment-username-input");
      const commentInput = page.getByTestId("comment-text-input");
      const submitButton = page.getByTestId("comment-submit-button");

      await expect(usernameInput).toBeVisible();
      await usernameInput.fill(randomizedUsername);
      await commentInput.fill(commentText);

      // Wait for POST response from comments endpoint
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/comments") &&
          response.request().method() === "POST",
      );

      await submitButton.click();

      const response = await responsePromise;

      expect(response.status()).toBe(201);

      // Verify using specific test IDs
      const newCommentItem = page
        .getByTestId("comment-item")
        .filter({ hasText: commentText })
        .first();

      await expect(newCommentItem).toBeVisible({ timeout: 10000 });
      await expect(newCommentItem.getByTestId("comment-username")).toHaveText(
        randomizedUsername,
      );
    });

    await test.step("7. Verify Metrics Updated", async () => {
      await page.goBack();
      await expect(page).toHaveURL("/");

      // Wait for analytics data to refresh
      const analyticsResponsePromise = page.waitForResponse(
        (res) => res.url().includes("/analytics") && res.status() === 200,
      );

      await analyticsResponsePromise;
      await page.waitForTimeout(1000); // Small wait for React to re-render

      if (topArticleTitle) {
        const updatedTopArticleItem = page
          .getByTestId("top-article-item")
          .filter({ hasText: topArticleTitle })
          .first();
        await expect(updatedTopArticleItem).toBeVisible();

        const updatedTopArticleCountText = await updatedTopArticleItem
          .getByTestId("article-comment-count")
          .textContent();
        const updatedTopArticleCommentCount = Number.parseInt(
          updatedTopArticleCountText || "0",
          10,
        );

        expect(updatedTopArticleCommentCount).toBe(topArticleCommentCount + 1);
      }

      if (topCommenterName) {
        const updatedTopContributorItem = page
          .getByTestId("contributor-item")
          .filter({ hasText: topCommenterName })
          .first();
        await expect(updatedTopContributorItem).toBeVisible();

        const updatedTopCommenterCountText = await updatedTopContributorItem
          .getByTestId("contributor-comment-count")
          .textContent();
        const updatedTopCommenterCommentCount = Number.parseInt(
          updatedTopCommenterCountText || "0",
          10,
        );

        expect(updatedTopCommenterCommentCount).toBe(
          topCommenterCommentCount + 1,
        );
      }
    });
  });
});
