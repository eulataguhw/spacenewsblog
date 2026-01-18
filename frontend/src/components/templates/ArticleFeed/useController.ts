import { useRef, useCallback } from "react";
import { useModel } from "./useModel";
// Removed unused imports

export const useController = () => {
  const {
    articles,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useModel();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      // Don't trigger if already loading (initial) or fetching next page
      if (isLoading || isFetchingNextPage || error) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error],
  );

  return {
    articles,
    error,
    isLoading, // Initial loading state
    isFetching: isFetchingNextPage, // Map isFetchingNextPage to isFetching for the UI spinner at bottom
    page: 1, // Dummy page value if UI relies on it for logic, or we update UI.
    // Looking at ArticleFeed.tsx, page > 1 shows bottom spinner.
    // We can pass `page: articles.length > 0 ? 2 : 1` or refactor UI.
    // Better: Return a derived page > 1 if we have articles.
    lastArticleElementRef,
  };
};
