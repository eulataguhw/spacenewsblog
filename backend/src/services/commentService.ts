import prisma from '../utils/prismaClient';

export const getCommentsByArticleId = async (articleId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { article_id: articleId },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.comment.count({ where: { article_id: articleId } }),
  ]);

  return {
    data: comments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createComment = async (articleId: string, data: { username: string; comment: string }) => {
  const { username, comment } = data;
  const username_normalized = username.toLowerCase();

  return prisma.comment.create({
    data: {
      article_id: articleId,
      username,
      username_normalized,
      comment,
    },
  });
};
