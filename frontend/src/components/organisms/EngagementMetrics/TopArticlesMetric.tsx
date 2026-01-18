import { Box, Typography, Stack } from "@mui/material";

interface TopArticlesMetricProps {
  model: {
    label: string;
    items: {
      articleId: string;
      commentCount: number;
      title: string;
    }[];
  };
}

export const TopArticlesMetric = ({ model }: TopArticlesMetricProps) => (
  <Box
    sx={{
      height: "100%",
      p: 2,
      borderRadius: 2,
      background: "rgba(255, 255, 255, 0.03)",
    }}
  >
    <Typography
      variant="overline"
      color="text.secondary"
      sx={{ mb: 1, display: "block" }}
    >
      {model.label}
    </Typography>
    <Stack spacing={1} data-testid="top-articles-list">
      {model.items.map((article, index) => (
        <Box
          key={article.articleId}
          display="flex"
          justifyContent="space-between"
          data-testid="top-article-item"
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%",
            }}
          >
            {index + 1}.{" "}
            <span data-testid="article-title">{article.title}</span>
          </Typography>
          <Typography
            variant="body2"
            color="primary.light"
            fontWeight={700}
            data-testid="article-comment-count"
          >
            {article.commentCount}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Box>
);
