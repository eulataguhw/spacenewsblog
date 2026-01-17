import { useGetArticlesQuery } from "../../../api/articlesApi";
import { useAppStore } from "../../../store/useAppStore";
import { ARTICLE_FEED_CONSTANTS } from "./constants";

export const useModel = (page: number) => {
  const { searchQuery, startDate, endDate, sortOrder } = useAppStore();

  const { data, error, isLoading, isFetching } = useGetArticlesQuery({
    page,
    search: searchQuery,
    startDate,
    endDate,
    sort: sortOrder,
    limit: ARTICLE_FEED_CONSTANTS.ITEMS_PER_PAGE,
  });

  return {
    articles: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    isFetching,
    searchQuery,
    startDate,
    endDate,
    sortOrder,
  };
};
