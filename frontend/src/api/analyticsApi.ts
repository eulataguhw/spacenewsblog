import { useQuery } from "@tanstack/react-query";
import { client } from "./client";

export interface AnalyticsData {
  topArticles: {
    articleId: string;
    commentCount: number;
    title?: string;
  }[];
  topCommenters: {
    username: string;
    commentCount: number;
  }[];
  averageCommentsPerDay: number;
}

export const getAnalytics = async () => {
  return client("/analytics");
};

export const useGetAnalyticsQuery = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });
};
