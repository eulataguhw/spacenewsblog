import { describe, it, expect, vi, beforeEach } from "vitest";
import * as commentService from "../services/commentService";
import prisma from "../utils/prismaClient";

// Mock prisma client
vi.mock("../utils/prismaClient", () => ({
  default: {
    comment: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("CommentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCommentsByArticleId", () => {
    it("should fetch comments with pagination and return metadata", async () => {
      const mockComments = [
        {
          id: "1",
          comment: "First",
          username: "user1",
          created_at: new Date(),
        },
        {
          id: "2",
          comment: "Second",
          username: "user2",
          created_at: new Date(),
        },
      ];
      const mockTotal = 10;

      vi.mocked(prisma.comment.findMany).mockResolvedValueOnce(mockComments);
      vi.mocked(prisma.comment.count).mockResolvedValueOnce(mockTotal);

      const articleId = "article-123";
      const page = 2;
      const limit = 2;

      const result = await commentService.getCommentsByArticleId(
        articleId,
        page,
        limit,
      );

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { article_id: articleId },
        skip: 2, // (2rd page - 1) * 2
        take: 2,
        orderBy: { created_at: "desc" },
      });

      expect(prisma.comment.count).toHaveBeenCalledWith({
        where: { article_id: articleId },
      });

      expect(result.data).toEqual(mockComments);
      expect(result.meta).toEqual({
        total: mockTotal,
        page: 2,
        limit: 2,
        totalPages: 5,
      });
    });

    it("should use default pagination values", async () => {
      vi.mocked(prisma.comment.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.comment.count).mockResolvedValueOnce(0);

      const articleId = "article-123";
      await commentService.getCommentsByArticleId(articleId);

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { article_id: articleId },
        skip: 0,
        take: 20,
        orderBy: { created_at: "desc" },
      });
    });
  });

  describe("createComment", () => {
    it("should create a comment and normalize the username", async () => {
      const articleId = "article-123";
      const input = {
        username: "RocketMan",
        comment: "To the moon!",
      };

      const mockCreatedComment = {
        id: "new-id",
        ...input,
        username_normalized: "rocketman",
        article_id: articleId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.mocked(prisma.comment.create).mockResolvedValueOnce(
        mockCreatedComment,
      );

      const result = await commentService.createComment(articleId, input);

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          article_id: articleId,
          username: "RocketMan",
          username_normalized: "rocketman",
          comment: "To the moon!",
        },
      });

      expect(result).toEqual(mockCreatedComment);
    });
  });
});
