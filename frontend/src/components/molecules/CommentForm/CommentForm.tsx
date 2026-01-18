import { Box, TextField, Button, Stack, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useController } from "./useController";
import { useModel } from "./useModel";
import { Typography } from "@components/atoms/Typography/Typography";

interface CommentFormProps {
  articleId: string;
}

export const CommentForm = ({ articleId }: CommentFormProps) => {
  const { register, handleSubmit, errors, isValid, isLoading, watch } =
    useController(articleId);
  const {
    title,
    usernameLabel,
    commentLabel,
    submitButton,
    submittingButton,
    getCommentLengthText,
  } = useModel();

  const commentValue = watch("comment");
  const commentLength = commentValue?.length || 0;

  return (
    <Paper sx={{ p: 3, mb: 4, background: "rgba(30, 41, 59, 0.4)" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label={usernameLabel}
            variant="outlined"
            size="small"
            fullWidth
            required
            disabled={isLoading}
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label={commentLabel}
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            required
            disabled={isLoading}
            {...register("comment")}
            error={!!errors.comment}
            helperText={
              <Box
                component="span"
                display="flex"
                justifyContent="space-between"
              >
                <span>{errors.comment?.message}</span>
                <span>{getCommentLengthText(commentLength, 500)}</span>
              </Box>
            }
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={isLoading || !isValid}
            >
              {isLoading ? submittingButton : submitButton}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
