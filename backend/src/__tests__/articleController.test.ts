import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import * as articleController from "../controllers/articleController";
import * as articleService from "../services/articleService";
import { ERROR_MESSAGES } from "../constants/errorMessages";

// Mock articleService
vi.mock("../services/articleService");

describe("ArticleController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("getArticles", () => {
    it("should return articles with 200 status", async () => {
      mockRequest = {
        query: {
          page: "1",
          limit: "10",
          search: "SpaceX",
        },
      };

      const mockResult = { data: [], meta: {} };
      vi.mocked(articleService.getAllArticles).mockResolvedValueOnce(
        mockResult as any,
      );

      await articleController.getArticles(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(articleService.getAllArticles).toHaveBeenCalledWith(
        1,
        10,
        "SpaceX",
        undefined,
        undefined,
        "-published_at",
      );
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it("should handle service errors", async () => {
      mockRequest = { query: {} };
      vi.mocked(articleService.getAllArticles).mockRejectedValueOnce(
        new Error("Service Error"),
      );

      await articleController.getArticles(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe("getArticle", () => {
    it("should return a single article", async () => {
      mockRequest = { params: { id: "123" } };
      const mockArticle = { id: "123", title: "Test" };
      vi.mocked(articleService.getArticleById).mockResolvedValueOnce(
        mockArticle as any,
      );

      await articleController.getArticle(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(articleService.getArticleById).toHaveBeenCalledWith("123");
      expect(jsonMock).toHaveBeenCalledWith(mockArticle);
    });

    it("should return 404 if article not found", async () => {
      mockRequest = { params: { id: "999" } };
      vi.mocked(articleService.getArticleById).mockResolvedValueOnce(
        null as any,
      );

      await articleController.getArticle(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.ARTICLE_NOT_FOUND,
      });
    });

    it("should handle service errors", async () => {
      mockRequest = { params: { id: "123" } };
      vi.mocked(articleService.getArticleById).mockRejectedValueOnce(
        new Error("Service Error"),
      );

      await articleController.getArticle(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });
});
