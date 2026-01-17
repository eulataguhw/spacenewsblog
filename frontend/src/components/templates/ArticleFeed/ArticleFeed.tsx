import { Grid, Box, CircularProgress, Typography, Alert } from "@mui/material";
import { ArticleCard } from "@components/organisms/ArticleCard/ArticleCard";
import { FilterBar } from "@components/molecules/FilterBar";
import { useController } from "./useController";
import { ARTICLE_FEED_CONSTANTS } from "./constants";

export const ArticleFeed = () => {
  const {
    articles,
    error,
    isLoading,
    isFetching,
    page,
    lastArticleElementRef,
  } = useController();

  const renderContent = () => {
    if (isLoading && page === ARTICLE_FEED_CONSTANTS.INITIAL_PAGE) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box p={2}>
          <Alert severity="error">{ARTICLE_FEED_CONSTANTS.ERROR_MESSAGE}</Alert>
        </Box>
      );
    }

    if (articles.length === 0) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            {ARTICLE_FEED_CONSTANTS.NO_ARTICLES_MESSAGE}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {articles.map((article, index) => {
          const isLastElement = articles.length === index + 1;
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={article.id}
              ref={isLastElement ? lastArticleElementRef : null}
            >
              <ArticleCard article={article} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <FilterBar />
      {renderContent()}
      {isFetching && page > 1 && (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};
