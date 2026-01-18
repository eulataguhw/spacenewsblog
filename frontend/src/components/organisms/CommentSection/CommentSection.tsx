import { Box, Stack, CircularProgress } from "@mui/material";
import { CommentForm } from "@components/molecules/CommentForm/CommentForm";
import { Typography } from "@components/atoms/Typography/Typography";
import { Comment } from "@api/commentsApi";
import { useModel } from "./useModel";

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
  isLoading?: boolean;
}

export const CommentSection = ({
  articleId,
  comments,
  isLoading,
}: CommentSectionProps) => {
  const { title, noComments, formatDate } = useModel(comments);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {title}
      </Typography>

      <CommentForm articleId={articleId} />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <Stack spacing={3}>
          {comments.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              {noComments}
            </Typography>
          ) : (
            comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "primary.light", fontWeight: 700 }}
                  >
                    {comment.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.created_at)}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {comment.comment}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};
