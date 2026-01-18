import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "./client";

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

export const getComments = async (articleId: string, params: any) => {
  const queryParams = new URLSearchParams(params).toString();
  return client(`/articles/${articleId}/comments?${queryParams}`);
};

export const useGetCommentsQuery = ({
  articleId,
  page = 1,
  limit = 10,
}: {
  articleId: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["comments", articleId, page, limit],
    queryFn: () => getComments(articleId, { page, limit }),
    enabled: !!articleId,
  });
};

export const createComment = async ({
  articleId,
  ...data
}: CreateCommentRequest) => {
  return client(`/articles/${articleId}/comments`, {
    body: data,
  } as {});
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleId],
      });
      queryClient.invalidateQueries({ queryKey: ["articles"] }); // Update comment counts on list if valid
      queryClient.invalidateQueries({ queryKey: ["analytics"] }); // Update analytics
    },
  });
};
