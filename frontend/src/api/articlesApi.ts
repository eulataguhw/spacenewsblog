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
        if (search) params.search = search;
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
          // Otherwise, append to existing data, filtering out duplicates
          const existingIds = new Set(currentCache.data.map((a) => a.id));
          const uniqueNewItems = newItems.data.filter(
            (a) => !existingIds.has(a.id),
          );
          currentCache.data.push(...uniqueNewItems);
          currentCache.meta = newItems.meta;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          !!previousArg &&
          (currentArg?.page !== previousArg?.page ||
            currentArg?.search !== previousArg?.search ||
            currentArg?.startDate !== previousArg?.startDate ||
            currentArg?.endDate !== previousArg?.endDate ||
            currentArg?.sort !== previousArg?.sort)
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
  }),
});

export const { useGetArticlesQuery, useGetArticleQuery } = articlesApi;
