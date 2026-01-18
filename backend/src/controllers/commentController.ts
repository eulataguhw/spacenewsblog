import { Request, Response } from "express";
import * as commentService from "../services/commentService";
import { z } from "zod";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const createCommentSchema = z.object({
  username: z.string().min(1, ERROR_MESSAGES.USERNAME_REQUIRED),
  comment: z.string().min(1, ERROR_MESSAGES.COMMENT_REQUIRED),
});

export const getComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      return res.status(400).json({ error: "Article ID is required" });
    }

    const { page: qPage, limit: qLimit } = req.query;
    const page =
      Number.parseInt(typeof qPage === "string" ? qPage : "1", 10) || 1;
    const limit =
      Number.parseInt(typeof qLimit === "string" ? qLimit : "20", 10) || 20;

    const result = await commentService.getCommentsByArticleId(
      articleId as string,
      page,
      limit,
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      return res
        .status(400)
        .json({ error: ERROR_MESSAGES.ARTICLE_ID_REQUIRED });
    }
    const validation = createCommentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const comment = await commentService.createComment(
      articleId as string,
      validation.data,
    );
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
