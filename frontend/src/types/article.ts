export interface Article {
  id: string;
  external_id?: string;
  title: string;
  summary?: string;
  image_url?: string;
  published_at: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
