import { useEffect } from "react";
import { useGetArticlesQuery } from "@api/articlesApi";
import { useAppStore } from "@store/useAppStore";
import { ARTICLE_FEED_CONSTANTS } from "./constants";

export const useModel = (page: number) => {
  const { searchQuery, startDate, endDate, sortOrder, addArticles } =
    useAppStore();

  const { data, error, isLoading, isFetching } = useGetArticlesQuery({
    page,
    search: searchQuery,
    startDate,
    endDate,
    sort: sortOrder,
    limit: ARTICLE_FEED_CONSTANTS.ITEMS_PER_PAGE,
  });

  // Sync fetched articles to Zustand for caching
  useEffect(() => {
    if (data?.data) {
      addArticles(data.data);
    }
  }, [data?.data, addArticles]);

  return {
    articles: data?.data || [],
    meta: data?.meta,
    error,
    isLoading: isLoading && page === 1,
    isFetching,
    searchQuery,
    startDate,
    endDate,
    sortOrder,
  };
};
