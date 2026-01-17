import { apiSlice } from './apiSlice';

export const articlesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ page = 1, limit = 20, search = '' }) => ({
        url: '/articles',
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Article' as const, id })),
              { type: 'Article', id: 'LIST' },
            ]
          : [{ type: 'Article', id: 'LIST' }],
    }),
    getArticle: builder.query({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),
    syncArticles: builder.mutation({
      query: () => ({
        url: '/articles/sync',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    getComments: builder.query({
      query: ({ articleId, page = 1, limit = 20 }) => ({
        url: `/articles/${articleId}/comments`,
        params: { page, limit },
      }),
      providesTags: (result, error, { articleId }) => [{ type: 'Comment', id: `LIST_${articleId}` }],
    }),
    createComment: builder.mutation({
      query: ({ articleId, body }) => ({
        url: `/articles/${articleId}/comments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { articleId }) => [
        { type: 'Comment', id: `LIST_${articleId}` },
        { type: 'Article', id: articleId }, // Invalidate article to update comment count if we had it
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
