import { ArticlesResponse } from "@app-types/article";
import { apiSlice } from "./apiSlice";

export const articlesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<
      ArticlesResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string | null;
        endDate?: string | null;
        sort?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        startDate,
        endDate,
        sort = "published_at:desc",
      }) => {
        const params: any = { page, limit, _sort: sort };
        if (search) params.title_contains = search;
        if (startDate) params.published_at_gte = startDate;
        if (endDate) params.published_at_lte = endDate;

        return {
          url: "/articles",
          params,
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Cache key depends on all filters. Page changes update the SAME cache entry.
        const { page, limit, ...filters } = queryArgs;
        return `${endpointName}(${JSON.stringify(filters)})`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          // If it's the first page (new search or reset), replace the cache
          currentCache.data = newItems.data;
          currentCache.meta = newItems.meta;
        } else {
          // Otherwise, append to existing data
          currentCache.data.push(...newItems.data);
          currentCache.meta = newItems.meta;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.search !== previousArg?.search ||
          currentArg?.startDate !== previousArg?.startDate ||
          currentArg?.endDate !== previousArg?.endDate ||
          currentArg?.sort !== previousArg?.sort
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Article" as const,
                id,
              })),
              { type: "Article", id: "LIST" },
            ]
          : [{ type: "Article", id: "LIST" }],
    }),
    getArticle: builder.query({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) => [{ type: "Article", id }],
    }),
    syncArticles: builder.mutation({
      query: () => ({
        url: "/articles/sync",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Article", id: "LIST" }],
    }),
    getComments: builder.query({
      query: ({ articleId, page = 1, limit = 20 }) => ({
        url: `/articles/${articleId}/comments`,
        params: { page, limit },
      }),
      providesTags: (result, error, { articleId }) => [
        { type: "Comment", id: `LIST_${articleId}` },
      ],
    }),
    createComment: builder.mutation({
      query: ({ articleId, body }) => ({
        url: `/articles/${articleId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { articleId }) => [
        { type: "Comment", id: `LIST_${articleId}` },
        { type: "Article", id: articleId }, // Invalidate article to update comment count if we had it
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useSyncArticlesMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
} = articlesApi;
