import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as spaceNewsApiService from "../services/spaceNewsApiService";
import {
  SpaceNewsApiResponse,
  SpaceNewsArticle,
} from "../types/spaceNewsTypes";
import { SPACE_NEWS_API } from "../constants/apiConstants";

// Mock fetch globally
globalThis.fetch = vi.fn();

describe("SpaceNewsApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    // Default mock to prevent "Cannot read properties of undefined"
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({}),
      text: async () => "",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockAbortFetch = (_url: string, options: any) => {
    return new Promise((_resolve, reject) => {
      if (options?.signal) {
        options.signal.addEventListener("abort", () => {
          const error = new Error("The operation was aborted");
          error.name = "AbortError";
          reject(error);
        });
      }
    });
  };

  describe("getArticles", () => {
    it("should fetch articles with default parameters", async () => {
      const mockResponse: SpaceNewsApiResponse = {
        count: 100,
        next: "https://api.spaceflightnewsapi.net/v4/articles?limit=20&offset=20",
        previous: null,
        results: [
          {
            id: 1,
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
          },
        ],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await spaceNewsApiService.getArticles();

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].title).toBe("Test Article");
    });

    it("should fetch articles with search parameter", async () => {
      const mockResponse: SpaceNewsApiResponse = {
        count: 5,
        next: null,
        previous: null,
        results: [],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await spaceNewsApiService.getArticles({ search: "SpaceX" });

      const fetchCall = (globalThis.fetch as any).mock.calls[0][0];
      expect(fetchCall).toContain("search=SpaceX");
    });

    it("should fetch articles with pagination parameters", async () => {
      const mockResponse: SpaceNewsApiResponse = {
        count: 100,
        next: null,
        previous:
          "https://api.spaceflightnewsapi.net/v4/articles?limit=10&offset=0",
        results: [],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await spaceNewsApiService.getArticles({ limit: 10, offset: 10 });

      const fetchCall = (globalThis.fetch as any).mock.calls[0][0];
      expect(fetchCall).toContain("limit=10");
      expect(fetchCall).toContain("offset=10");
    });

    it("should fetch articles with ordering parameter", async () => {
      const mockResponse: SpaceNewsApiResponse = {
        count: 100,
        next: null,
        previous: null,
        results: [],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await spaceNewsApiService.getArticles({ ordering: "-published_at" });

      const fetchCall = (globalThis.fetch as any).mock.calls[0][0];
      expect(fetchCall).toContain("ordering=-published_at");
    });

    it("should throw error when API returns non-ok response", async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Internal Server Error",
      });

      await expect(spaceNewsApiService.getArticles()).rejects.toThrow(
        "Space News API error: 500 Internal Server Error",
      );
    });

    it("should throw error on network failure", async () => {
      (globalThis.fetch as any).mockRejectedValue(new Error("Network error"));

      await expect(spaceNewsApiService.getArticles()).rejects.toThrow(
        "Failed to fetch articles: Network error",
      );
    });

    it("should handle timeout", async () => {
      vi.useFakeTimers();
      (globalThis.fetch as any).mockImplementationOnce(mockAbortFetch);

      const promise = spaceNewsApiService.getArticles();

      // Fast-forward time to trigger the timeout in the service
      await vi.advanceTimersByTimeAsync(SPACE_NEWS_API.TIMEOUT + 1);

      await expect(promise).rejects.toThrow(
        "Request to Space News API timed out",
      );
    });
  });

  describe("getArticleById", () => {
    it("should fetch a single article by ID", async () => {
      const mockArticle: SpaceNewsArticle = {
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

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticle,
        text: async () => JSON.stringify(mockArticle),
      });

      const result = await spaceNewsApiService.getArticleById(123);

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockArticle);
      expect(result.id).toBe(123);
      expect(result.title).toBe("Test Article");
    });

    it("should throw error when article is not found", async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => "Not Found",
      });

      await expect(spaceNewsApiService.getArticleById(999)).rejects.toThrow(
        "Article not found",
      );
    });

    it("should throw error on API error", async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Internal Server Error",
      });

      await expect(spaceNewsApiService.getArticleById(123)).rejects.toThrow(
        "Space News API error: 500 Internal Server Error",
      );
    });

    it("should handle timeout", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";

      (globalThis.fetch as any).mockRejectedValueOnce(abortError);

      await expect(spaceNewsApiService.getArticleById(123)).rejects.toThrow(
        "Request to Space News API timed out",
      );
    });
  });
});
