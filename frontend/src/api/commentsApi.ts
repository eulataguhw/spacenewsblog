import { apiSlice } from "./apiSlice";

export interface Comment {
  id: string;
  article_id: string;
  username: string;
  comment: string;
  created_at: string;
}

export interface GetCommentsResponse {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCommentRequest {
  articleId: string;
  username: string;
  comment: string;
}

export const commentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<
      GetCommentsResponse,
      { articleId: string; page?: number; limit?: number }
    >({
      query: ({ articleId, ...params }) => ({
        url: `/articles/${articleId}/comments`,
        params,
      }),
      providesTags: (result, _error, { articleId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Comment" as const,
                id,
              })),
              { type: "Comment", id: `LIST_${articleId}` },
            ]
          : [{ type: "Comment", id: `LIST_${articleId}` }],
    }),
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: ({ articleId, ...body }) => ({
        url: `/articles/${articleId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { articleId }) => [
        { type: "Comment", id: `LIST_${articleId}` },
      ],
    }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentsApi;
