import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import * as commentController from "../controllers/commentController";
import * as commentService from "../services/commentService";
import { ERROR_MESSAGES } from "../constants/errorMessages";

// Mock commentService
vi.mock("../services/commentService");

describe("CommentController", () => {
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

  describe("getComments", () => {
    it("should return comments with 200 status", async () => {
      mockRequest = {
        params: { articleId: "123" },
        query: { page: "1", limit: "10" },
      };

      const mockResult = { data: [], meta: {} };
      vi.mocked(commentService.getCommentsByArticleId).mockResolvedValueOnce(
        mockResult as any,
      );

      await commentController.getComments(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(commentService.getCommentsByArticleId).toHaveBeenCalledWith(
        "123",
        1,
        10,
      );
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it("should use default pagination values if query params are missing", async () => {
      mockRequest = {
        params: { articleId: "123" },
        query: {}, // Missing page and limit
      };

      const mockResult = { data: [], meta: {} };
      vi.mocked(commentService.getCommentsByArticleId).mockResolvedValueOnce(
        mockResult as any,
      );

      await commentController.getComments(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(commentService.getCommentsByArticleId).toHaveBeenCalledWith(
        "123",
        1,
        20,
      );
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error if articleId is missing", async () => {
      mockRequest = { params: {} };

      await commentController.getComments(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Article ID is required",
      });
    });

    it("should handle service errors", async () => {
      mockRequest = { params: { articleId: "123" } };
      vi.mocked(commentService.getCommentsByArticleId).mockRejectedValueOnce(
        new Error("Service Error"),
      );

      await commentController.getComments(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe("createComment", () => {
    it("should create a comment and return 201 status", async () => {
      mockRequest = {
        params: { articleId: "123" },
        body: {
          username: "tester",
          comment: "this is a long enough comment for validation",
        },
      };

      const mockComment = { id: "1", ...mockRequest.body };
      vi.mocked(commentService.createComment).mockResolvedValueOnce(
        mockComment,
      );

      await commentController.createComment(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(commentService.createComment).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          username: "tester",
          comment: "this is a long enough comment for validation",
        }),
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockComment);
    });

    it("should return 400 if validation fails", async () => {
      mockRequest = {
        params: { articleId: "123" },
        body: { username: "", comment: "short" },
      };

      await commentController.createComment(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Array), // Zod issues
        }),
      );
    });

    it("should return 500 if service throws error", async () => {
      mockRequest = {
        params: { articleId: "123" },
        body: {
          username: "tester",
          comment: "valid comment text here at least 10 chars",
        },
      };

      vi.mocked(commentService.createComment).mockRejectedValueOnce(
        new Error("Internal"),
      );

      await commentController.createComment(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });

    it("should return 400 if articleId is missing", async () => {
      mockRequest = { params: {} };

      await commentController.createComment(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.ARTICLE_ID_REQUIRED,
      });
    });
  });
});
