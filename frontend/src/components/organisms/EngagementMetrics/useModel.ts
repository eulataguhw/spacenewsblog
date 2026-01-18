import { useMemo } from "react";
import { useGetAnalyticsQuery } from "@api/analyticsApi";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@store/useAppStore";
import { ENGAGEMENT_METRICS_KEYS } from "./constants";

export const useModel = () => {
  const { t: translation } = useTranslation();
  const cachedArticles = useAppStore((state) => state.articles);
  const {
    data: rawMetrics,
    isLoading,
    error,
  } = useGetAnalyticsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const title = translation(ENGAGEMENT_METRICS_KEYS.TITLE);

  const models = useMemo(() => {
    if (!rawMetrics) return null;

    return {
      activityModel: {
        label: translation(ENGAGEMENT_METRICS_KEYS.ACTIVITY),
        value: rawMetrics.averageCommentsPerDay,
        subLabel: translation(ENGAGEMENT_METRICS_KEYS.AVG_COMMENTS),
      },
      articlesModel: {
        label: translation(ENGAGEMENT_METRICS_KEYS.TOP_ARTICLES),
        items: rawMetrics.topArticles.map((item) => ({
          ...item,
          title:
            item.title ||
            cachedArticles[item.articleId]?.title ||
            `Article ${item.articleId.substring(0, 8)}...`,
        })),
      },
      contributorsModel: {
        label: translation(ENGAGEMENT_METRICS_KEYS.TOP_COMMENTERS),
        items: rawMetrics.topCommenters,
      },
    };
  }, [rawMetrics, cachedArticles, translation]);

  return {
    models,
    isLoading,
    error,
    title,
  };
};
