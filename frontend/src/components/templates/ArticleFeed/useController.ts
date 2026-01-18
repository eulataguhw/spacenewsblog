import { useRef, useCallback } from "react";
import { useAppStore } from "@store/useAppStore";
import { useModel } from "./useModel";
// Removed unused imports

export const useController = () => {
  const { page, setPage } = useAppStore();

  const { articles, meta, error, isLoading, isFetching } = useModel(page);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching || error) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && meta && page < meta.totalPages) {
          setPage((prevPage: number) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, meta, page, error],
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
