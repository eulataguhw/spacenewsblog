import prisma from "../utils/prismaClient";
import { getArticleById } from "./articleService";

export const getEngagementMetrics = async () => {
  const [topArticles, topCommenters, totalComments, uniqueDays] =
    await Promise.all([
      // Top 3 Most Commented Articles
      prisma.comment.groupBy({
        by: ["article_id"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 3,
      }),

      // Top 3 Commenters
      prisma.comment.groupBy({
        by: ["username_normalized"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 3,
      }),

      // Total Comments for Avg Calculation
      prisma.comment.count(),

      // Unique days count for Avg Calculation
      prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT DATE(created_at)) as count FROM comments
    `,
    ]);

  const daysCount = Number((uniqueDays as any)[0]?.count || 1);
  const avgCommentsPerDay = daysCount > 0 ? totalComments / daysCount : 0;

  const topArticlesWithDetails = await Promise.all(
    (topArticles as any[]).map(async (a) => {
      try {
        const article = await getArticleById(a.article_id);
        return {
          articleId: a.article_id,
          commentCount: a._count.id,
          title: article.title,
        };
      } catch (error) {
        console.error(
          `Failed to fetch details for article ${a.article_id}:`,
          error,
        );
        return {
          articleId: a.article_id,
          commentCount: a._count.id,
          title: `Article #${a.article_id}`,
        };
      }
    }),
  );

  const topCommentersWithDetails = await Promise.all(
    (topCommenters as any[]).map(async (c) => {
      const userComment = await prisma.comment.findFirst({
        where: { username_normalized: c.username_normalized },
        select: { username: true },
      });
      return {
        username: userComment?.username || c.username_normalized,
        commentCount: c._count.id,
      };
    }),
  );

  return {
    topArticles: topArticlesWithDetails,
    topCommenters: topCommentersWithDetails,
    averageCommentsPerDay: Number(avgCommentsPerDay.toFixed(2)),
  };
};
