export interface SpaceNewsArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: Array<{
    launch_id: string;
    provider: string;
  }>;
  events: Array<{
    event_id: number;
    provider: string;
  }>;
}

export interface SpaceNewsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SpaceNewsArticle[];
}

export interface ArticleQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  news_site?: string;
  has_event?: boolean;
  has_launch?: boolean;
  published_at_gte?: string;
  published_at_lte?: string;
  ordering?: string;
}
