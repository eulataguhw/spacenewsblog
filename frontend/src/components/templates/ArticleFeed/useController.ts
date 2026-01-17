import { useState, useEffect, useRef, useCallback } from "react";
import { useModel } from "./useModel";
import { ARTICLE_FEED_CONSTANTS } from "./constants";
// Removed unused imports

export const useController = () => {
  const [page, setPage] = useState(ARTICLE_FEED_CONSTANTS.INITIAL_PAGE);
  const {
    articles,
    meta,
    error,
    isLoading,
    isFetching,
    searchQuery,
    startDate,
    endDate,
    sortOrder,
  } = useModel(page);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(ARTICLE_FEED_CONSTANTS.INITIAL_PAGE);
  }, [searchQuery, startDate, endDate, sortOrder]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && meta && page < meta.totalPages) {
          setPage((prevPage: number) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, meta, page],
  );

  return {
    articles,
    error,
    isLoading,
    isFetching,
    page,
    lastArticleElementRef,
  };
};
