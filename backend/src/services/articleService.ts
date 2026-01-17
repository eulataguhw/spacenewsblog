import prisma from '../utils/prismaClient';

export const getAllArticles = async (page: number = 1, limit: number = 20, search?: string) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { published_at: 'desc' },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getArticleById = async (id: string) => {
  return prisma.article.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { created_at: 'desc' },
      },
    },
  });
};
