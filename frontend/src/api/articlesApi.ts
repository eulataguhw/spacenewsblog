import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { client } from "./client";
import { Article, ArticlesResponse } from "@app-types/article";

export const getArticles = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, { limit, search, startDate, endDate, sort }] = queryKey;
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: limit.toString(),
    _sort: sort,
  });

  if (search) params.append("search", search);
  if (startDate) params.append("published_at_gte", startDate);
  if (endDate) params.append("published_at_lte", endDate);

  return client(`/articles?${params.toString()}`);
};

export const useGetArticlesQuery = (params: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string | null;
  endDate?: string | null;
  sort?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["articles", params],
    queryFn: getArticles,
    getNextPageParam: (lastPage: ArticlesResponse) => {
      const { meta } = lastPage;
      const nextPage = meta.page + 1;
      return nextPage <= meta.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export const getArticle = async (id: string) => {
  return client(`/articles/${id}`);
};

export const useGetArticleQuery = (id: string, options?: any) => {
  return useQuery<Article>({
    queryKey: ["article", id],
    queryFn: () => getArticle(id),
    enabled: !!id,
    ...options,
  });
};
