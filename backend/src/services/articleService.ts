import prisma from "../utils/prismaClient";
import * as spaceNewsApiService from "./spaceNewsApiService";

export const getAllArticles = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  startDate?: string,
  endDate?: string,
  sort: string = "-published_at",
) => {
  const offset = (page - 1) * limit;

  // Map frontend sort order to Space News API ordering format
  const sortMap: Record<string, string> = {
    "published_at:desc": "-published_at",
    "published_at:asc": "published_at",
  };
  const ordering = sortMap[sort] || sort;

  try {
    const response = await spaceNewsApiService.getArticles({
      limit,
      offset,
      search,
      published_at_gte: startDate,
      published_at_lte: endDate,
      ordering,
    });

    return {
      data: response.results.map((article) => ({
        id: article.id.toString(),
        external_id: article.id.toString(),
        title: article.title,
        summary: article.summary,
        image_url: article.image_url,
        published_at: new Date(article.published_at),
        source: article.news_site,
        url: article.url,
        featured: article.featured,
      })),
      meta: {
        total: response.count,
        page,
        limit,
        totalPages: Math.ceil(response.count / limit),
        next: response.next,
        previous: response.previous,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === "TypeError") throw error;
    throw new Error(
      error instanceof Error
        ? `Failed to fetch articles: ${error.message}`
        : "Failed to fetch articles from Space News API",
    );
  }
};

export const getArticleById = async (id: string) => {
  try {
    const articleId = Number.parseInt(id, 10);
    if (Number.isNaN(articleId)) {
      throw new TypeError("Invalid article ID");
    }

    const article = await spaceNewsApiService.getArticleById(articleId);

    // Fetch comments from local database
    const comments = await prisma.comment.findMany({
      where: { article_id: id },
      orderBy: { created_at: "desc" },
    });

    return {
      id: article.id.toString(),
      external_id: article.id.toString(),
      title: article.title,
      summary: article.summary,
      image_url: article.image_url,
      published_at: new Date(article.published_at),
      source: article.news_site,
      url: article.url,
      featured: article.featured,
      comments,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "TypeError") throw error;
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch article from Space News API",
    );
  }
};
