import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { z } from 'zod';

const createCommentSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  comment: z.string().min(1, 'Comment is required'),
});

export const getComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await commentService.getCommentsByArticleId(articleId, page, limit);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const validation = createCommentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const comment = await commentService.createComment(articleId, validation.data);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
