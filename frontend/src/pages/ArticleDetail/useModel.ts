import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "@api/articlesApi";
import { useGetCommentsQuery } from "@api/commentsApi";
import { useAppStore } from "@store/useAppStore";

export const useModel = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, addArticle } = useAppStore();

  const cachedArticle = id ? articles[id] : undefined;

  const {
    data: fetchedArticle,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useGetArticleQuery(id || "", { skip: !id || !!cachedArticle });

  const article = cachedArticle || fetchedArticle;

  // Sync fetched single article back to Zustand
  useEffect(() => {
    if (fetchedArticle) {
      addArticle(fetchedArticle);
    }
  }, [fetchedArticle, addArticle]);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isFetching: isCommentsFetching,
  } = useGetCommentsQuery({ articleId: id || "" }, { skip: !id });

  return {
    id,
    article,
    comments: commentsData?.data || [],
    isLoading: isArticleLoading,
    isCommentsLoading: isCommentsLoading || isCommentsFetching,
    isError: isArticleError,
  };
};
