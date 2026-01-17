import { Request, Response } from 'express';
import * as articleService from '../services/articleService';
import * as syncService from '../services/syncService';

export const syncArticles = async (req: Request, res: Response) => {
  try {
    const result = await syncService.syncArticles();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sync failed' });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const result = await articleService.getAllArticles(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
