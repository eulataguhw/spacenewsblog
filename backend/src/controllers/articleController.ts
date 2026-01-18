import { Request, Response } from "express";
import * as articleService from "../services/articleService";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const startDate = req.query.published_at_gte as string;
    const endDate = req.query.published_at_lte as string;
    const sort = (req.query._sort as string) || "-published_at";

    const result = await articleService.getAllArticles(
      page,
      limit,
      search,
      startDate,
      endDate,
      sort,
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id.toString());

    if (!article) {
      return res.status(404).json({ error: ERROR_MESSAGES.ARTICLE_NOT_FOUND });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
