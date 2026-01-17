const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

export interface SpaceflightArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: any[];
  events: any[];
}

export const fetchArticles = async (limit: number = 10, offset: number = 0) => {
  const response = await fetch(`${BASE_URL}/articles?limit=${limit}&offset=${offset}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
