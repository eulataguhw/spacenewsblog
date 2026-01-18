import { describe, it, expect, vi, beforeEach } from "vitest";
import * as analyticsService from "../services/analyticsService";
import prisma from "../utils/prismaClient";

// Mock articleService
vi.mock("../services/articleService", () => ({
  getArticleById: vi.fn(),
}));

// Mock prisma client
vi.mock("../utils/prismaClient", () => ({
  default: {
    comment: {
      groupBy: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

describe("AnalyticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getEngagementMetrics", () => {
    it("should calculate engagement metrics correctly", async () => {
      const mockTopArticles = [
        { article_id: "article-1", _count: { id: 10 } },
        { article_id: "article-2", _count: { id: 5 } },
      ];
      const mockTopCommenters = [
        { username_normalized: "user1", _count: { id: 20 } },
        { username_normalized: "user2", _count: { id: 15 } },
      ];
      const mockTotalComments = 35;
      const mockUniqueDays = [{ count: 7n }]; // queryRaw returns BigInt usually for COUNT

      vi.mocked(prisma.comment.groupBy)
        .mockResolvedValueOnce(mockTopArticles)
        .mockResolvedValueOnce(mockTopCommenters);

      vi.mocked(prisma.comment.count).mockResolvedValueOnce(mockTotalComments);
      vi.mocked(prisma.$queryRaw).mockResolvedValueOnce(mockUniqueDays);

      const { getArticleById } = await import("../services/articleService");
      vi.mocked(getArticleById).mockImplementation(
        async (id) =>
          ({
            id,
            title: `Title for ${id}`,
          }) as any,
      );

      vi.mocked(prisma.comment.findFirst).mockImplementation((async (
        args: any,
      ) => {
        // Return original username based on normalized input
        const norm = args?.where?.username_normalized;
        return { username: norm === "user1" ? "User1" : "User2" };
      }) as any);

      const result = await analyticsService.getEngagementMetrics();

      expect(prisma.comment.groupBy).toHaveBeenCalledTimes(2);
      expect(prisma.comment.count).toHaveBeenCalled();
      expect(prisma.$queryRaw).toHaveBeenCalled();

      expect(result.topArticles).toEqual([
        {
          articleId: "article-1",
          commentCount: 10,
          title: "Title for article-1",
        },
        {
          articleId: "article-2",
          commentCount: 5,
          title: "Title for article-2",
        },
      ]);
      expect(result.topCommenters).toEqual([
        { username: "User1", commentCount: 20 },
        { username: "User2", commentCount: 15 },
      ]);
      expect(result.averageCommentsPerDay).toBe(5); // 35 / 7
    });

    it("should handle BigInt conversion and fallback for daysCount", async () => {
      vi.mocked(prisma.comment.groupBy).mockResolvedValue([]);
      vi.mocked(prisma.comment.count).mockResolvedValue(10);
      vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ count: 0n }]);

      const result = await analyticsService.getEngagementMetrics();

      // If daysCount is 0, it falls back to 1 or avoids division by zero (result 10 if total 10)
      // Looking at service: const daysCount = Number((uniqueDays as any)[0]?.count || 1);
      // const avgCommentsPerDay = daysCount > 0 ? totalComments / daysCount : 0;
      // If count: 0n, Number(0n) is 0. fallback || 1 makes it 1.
      expect(result.averageCommentsPerDay).toBe(10);
    });

    it("should handle empty days list from queryRaw", async () => {
      vi.mocked(prisma.comment.groupBy).mockResolvedValue([]);
      vi.mocked(prisma.comment.count).mockResolvedValue(10);
      vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([]); // Empty array

      const result = await analyticsService.getEngagementMetrics();
      expect(result.averageCommentsPerDay).toBe(10);
    });
  });
});
