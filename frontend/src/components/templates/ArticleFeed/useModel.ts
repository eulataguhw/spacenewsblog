import { useEffect, useMemo } from "react";
import { useGetArticlesQuery } from "@api/articlesApi";
import { useAppStore } from "@store/useAppStore";
import { ARTICLE_FEED_CONSTANTS } from "./constants";
import { useShallow } from "zustand/react/shallow";

export const useModel = () => {
  const { searchQuery, startDate, endDate, sortOrder } = useAppStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      startDate: state.startDate,
      endDate: state.endDate,
      sortOrder: state.sortOrder,
    })),
  );

  const {
    data,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetArticlesQuery({
    search: searchQuery,
    startDate,
    endDate,
    sort: sortOrder,
    limit: ARTICLE_FEED_CONSTANTS.ITEMS_PER_PAGE,
  });

  const articles = useMemo(
    () => data?.pages.flatMap((page: any) => page.data) || [],
    [data?.pages],
  );

  // Sync fetched articles to Zustand for caching
  useEffect(() => {
    if (articles.length > 0) {
      // Defer state update to avoid render cycle warnings if necessary,
      // but standard useEffect is usually fine.
      useAppStore.getState().addArticles(articles);
    }
  }, [articles]);

  return {
    articles,
    error,
    isLoading,
    isFetching, // This includes background refetches
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    searchQuery,
  };
};
