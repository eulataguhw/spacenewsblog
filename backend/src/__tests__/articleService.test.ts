import { describe, it, expect, vi, beforeEach } from "vitest";
import * as articleService from "../services/articleService";
import spaceNewsApiService from "../services/spaceNewsApiService";
import prisma from "../utils/prismaClient";
import type { SpaceNewsApiResponse } from "../types/spaceNewsTypes";

// Mock dependencies
vi.mock("../services/spaceNewsApiService");
vi.mock("../utils/prismaClient", () => ({
  default: {
    comment: {
      findMany: vi.fn(),
    },
  },
}));

describe("ArticleService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllArticles", () => {
    it("should fetch and transform articles from Space News API", async () => {
      const mockApiResponse: SpaceNewsApiResponse = {
        count: 100,
        next: "https://api.spaceflightnewsapi.net/v4/articles?limit=20&offset=20",
        previous: null,
        results: [
          {
            id: 1,
            title: "SpaceX Launches Starship",
            url: "https://example.com/article",
            image_url: "https://example.com/image.jpg",
            news_site: "Space News",
            summary: "SpaceX successfully launched Starship",
            published_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            featured: true,
            launches: [],
            events: [],
          },
          {
            id: 2,
            title: "NASA Artemis Update",
            url: "https://example.com/article2",
            image_url: "https://example.com/image2.jpg",
            news_site: "NASA",
            summary: "NASA provides update on Artemis program",
            published_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
            featured: false,
            launches: [],
            events: [],
          },
        ],
      };

      vi.mocked(spaceNewsApiService.getArticles).mockResolvedValueOnce(
        mockApiResponse,
      );

      const result = await articleService.getAllArticles(1, 20);

      expect(spaceNewsApiService.getArticles).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        search: undefined,
        ordering: "-published_at",
      });

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        id: "1",
        external_id: "1",
        title: "SpaceX Launches Starship",
        source: "Space News",
        featured: true,
      });
      expect(result.meta).toEqual({
        total: 100,
        page: 1,
        limit: 20,
        totalPages: 5,
        next: mockApiResponse.next,
        previous: null,
      });
    });

    it("should handle pagination correctly", async () => {
      const mockApiResponse: SpaceNewsApiResponse = {
        count: 100,
        next: null,
        previous:
          "https://api.spaceflightnewsapi.net/v4/articles?limit=10&offset=10",
        results: [],
      };

      vi.mocked(spaceNewsApiService.getArticles).mockResolvedValueOnce(
        mockApiResponse,
      );

      await articleService.getAllArticles(3, 10);

      expect(spaceNewsApiService.getArticles).toHaveBeenCalledWith({
        limit: 10,
        offset: 20, // (page 3 - 1) * 10
        search: undefined,
        ordering: "-published_at",
      });
    });

    it("should pass search parameter to API", async () => {
      const mockApiResponse: SpaceNewsApiResponse = {
        count: 5,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(spaceNewsApiService.getArticles).mockResolvedValueOnce(
        mockApiResponse,
      );

      await articleService.getAllArticles(1, 20, "SpaceX");

      expect(spaceNewsApiService.getArticles).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        search: "SpaceX",
        ordering: "-published_at",
      });
    });

    it("should throw error when API call fails", async () => {
      vi.mocked(spaceNewsApiService.getArticles).mockRejectedValueOnce(
        new Error("API Error"),
      );

      await expect(articleService.getAllArticles(1, 20)).rejects.toThrow(
        "Failed to fetch articles: API Error",
      );
    });

    it("should transform published_at to Date object", async () => {
      const mockApiResponse: SpaceNewsApiResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Test",
            url: "https://example.com",
            image_url: "https://example.com/image.jpg",
            news_site: "Test",
            summary: "Test",
            published_at: "2024-01-15T12:30:00Z",
            updated_at: "2024-01-15T12:30:00Z",
            featured: false,
            launches: [],
            events: [],
          },
        ],
      };

      vi.mocked(spaceNewsApiService.getArticles).mockResolvedValueOnce(
        mockApiResponse,
      );

      const result = await articleService.getAllArticles(1, 20);

      expect(result.data[0].published_at).toBeInstanceOf(Date);
      expect(result.data[0].published_at.toISOString()).toBe(
        "2024-01-15T12:30:00.000Z",
      );
    });
  });

  describe("getArticleById", () => {
    it("should fetch article and combine with comments", async () => {
      const mockArticle = {
        id: 123,
        title: "Test Article",
        url: "https://example.com/article",
        image_url: "https://example.com/image.jpg",
        news_site: "Test Site",
        summary: "Test summary",
        published_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        featured: false,
        launches: [],
        events: [],
      };

      const mockComments = [
        {
          id: "comment-1",
          article_id: "123",
          username: "user1",
          username_normalized: "user1",
          comment: "Great article!",
          created_at: new Date("2024-01-02T00:00:00Z"),
          updated_at: new Date("2024-01-02T00:00:00Z"),
        },
      ];

      vi.mocked(spaceNewsApiService.getArticleById).mockResolvedValueOnce(
        mockArticle,
      );
      vi.mocked(prisma.comment.findMany).mockResolvedValueOnce(mockComments);

      const result = await articleService.getArticleById("123");

      expect(spaceNewsApiService.getArticleById).toHaveBeenCalledWith(123);
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { article_id: "123" },
        orderBy: { created_at: "desc" },
      });

      expect(result).toMatchObject({
        id: "123",
        title: "Test Article",
        source: "Test Site",
      });
      expect(result.comments).toEqual(mockComments);
    });

    it("should throw TypeError for invalid article ID", async () => {
      await expect(articleService.getArticleById("invalid")).rejects.toThrow(
        TypeError,
      );
      await expect(articleService.getArticleById("invalid")).rejects.toThrow(
        "Invalid article ID",
      );
    });

    it("should throw error when article is not found", async () => {
      vi.mocked(spaceNewsApiService.getArticleById).mockRejectedValueOnce(
        new Error("Article not found"),
      );

      await expect(articleService.getArticleById("999")).rejects.toThrow(
        "Article not found",
      );
    });

    it("should handle API errors gracefully", async () => {
      vi.mocked(spaceNewsApiService.getArticleById).mockRejectedValueOnce(
        new Error("API Error"),
      );

      await expect(articleService.getArticleById("123")).rejects.toThrow(
        "API Error",
      );
    });

    it("should fetch article with no comments", async () => {
      const mockArticle = {
        id: 123,
        title: "Test Article",
        url: "https://example.com/article",
        image_url: "https://example.com/image.jpg",
        news_site: "Test Site",
        summary: "Test summary",
        published_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        featured: false,
        launches: [],
        events: [],
      };

      vi.mocked(spaceNewsApiService.getArticleById).mockResolvedValueOnce(
        mockArticle,
      );
      vi.mocked(prisma.comment.findMany).mockResolvedValueOnce([]);

      const result = await articleService.getArticleById("123");

      expect(result.comments).toEqual([]);
    });
  });
});
