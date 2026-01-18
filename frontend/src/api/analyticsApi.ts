import { apiSlice } from "./apiSlice";

export interface AnalyticsData {
  topArticles: {
    articleId: string;
    commentCount: number;
    title?: string; // Frontend might need to fetch title separately or backend provides it?
    // Backend service only returns articleId and count based on aggregation.
    // For now we display ID, or ideally backend should include title.
    // Based on analyticsService.ts, it maps manual objects.
  }[];
  topCommenters: {
    username: string;
    commentCount: number;
  }[];
  averageCommentsPerDay: number;
}

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/analytics",
      providesTags: ["Comment"], // Invalidating "Comment" should refetch analytics potentially?
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
