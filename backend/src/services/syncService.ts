import prisma from '../utils/prismaClient';
import * as spaceflightApi from './spaceflightApi';

export const syncArticles = async () => {
  try {
    console.log('Starting article sync...');
    // Fetch latest 50 articles
    const response = await spaceflightApi.fetchArticles(50);
    const articles = response.results;

    let newCount = 0;

    for (const article of articles) {
      // Check if article exists
      const existing = await prisma.article.findUnique({
        where: { external_id: String(article.id) },
      });

      if (!existing) {
        await prisma.article.create({
          data: {
            external_id: String(article.id),
            title: article.title,
            summary: article.summary,
            image_url: article.image_url,
            published_at: new Date(article.published_at),
            source: article.news_site,
          },
        });
        newCount++;
      }
    }

    console.log(`Sync complete. Added ${newCount} new articles.`);
    return { status: 'success', newArticles: newCount };
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
};
