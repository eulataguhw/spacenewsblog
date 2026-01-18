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
    <Stack spacing={1}>
      {model.items.map((article, index) => (
        <Box
          key={article.articleId}
          display="flex"
          justifyContent="space-between"
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
            {index + 1}. {article.title}
          </Typography>
          <Typography variant="body2" color="primary.light" fontWeight={700}>
            {article.commentCount}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Box>
);
