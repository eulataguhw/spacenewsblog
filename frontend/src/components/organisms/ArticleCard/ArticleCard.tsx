import { Card, CardContent, CardMedia, Chip, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Typography } from "@components/atoms/Typography/Typography";
import { Article } from "@app-types/article";
import { useController } from "./useController";
import { useModel } from "./useModel";
import { ARTICLE_CARD_CONSTANTS } from "./constants";

interface ArticleCardProps {
  article: Article;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    background: "rgba(15, 23, 42, 0.6)",
    borderColor: "rgba(6, 182, 212, 0.5)",
    boxShadow:
      "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)",
  },
}));

export const ArticleCard = ({ article: propArticle }: ArticleCardProps) => {
  const { article } = useModel(propArticle);
  const { handleCardClick } = useController(propArticle);

  return (
    <StyledCard onClick={handleCardClick}>
      {article.image_url && (
        <CardMedia
          component="img"
          image={article.image_url}
          alt={article.title}
          sx={{ height: 200, objectFit: "cover" }}
        />
      )}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Chip
            label={article.source}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(article.published_at).toLocaleDateString(
              ARTICLE_CARD_CONSTANTS.DATE_LOCALE,
            )}
          </Typography>
        </Stack>

        <Typography variant="h6" component="h2" gutterBottom>
          {article.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {article.summary}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};
