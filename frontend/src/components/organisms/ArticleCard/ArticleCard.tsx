import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
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
