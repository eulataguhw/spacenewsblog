import { useTranslation } from "react-i18next";
import { Article } from "@app-types/article";
import { Grid, Box, CircularProgress, Typography, Alert } from "@mui/material";
import { ArticleCard } from "@components/organisms/ArticleCard/ArticleCard";
import { FilterBar } from "@components/molecules/FilterBar";
import { useController } from "./useController";
import { ARTICLE_FEED_CONSTANTS } from "./constants";

export const ArticleFeed = () => {
  const { t: translation } = useTranslation();
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

    // Show error only if it's the first page. For subsequent pages, we show error at the bottom.
    if (error && page === ARTICLE_FEED_CONSTANTS.INITIAL_PAGE) {
      return (
        <Box p={2}>
          <Alert severity="error">
            <Typography variant="inherit" component="span">
              {translation(ARTICLE_FEED_CONSTANTS.ERROR_MESSAGE)}
            </Typography>
          </Alert>
        </Box>
      );
    }

    if (articles.length === 0 && !isLoading && !isFetching) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            {translation(ARTICLE_FEED_CONSTANTS.NO_ARTICLES_MESSAGE)}
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Grid container spacing={3}>
          {articles.map((article: Article, index: number) => {
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
        {error && page > ARTICLE_FEED_CONSTANTS.INITIAL_PAGE && (
          <Box p={2} mt={2}>
            <Alert severity="error">
              {translation(ARTICLE_FEED_CONSTANTS.ERROR_MESSAGE)}
            </Alert>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box className="page-transition" sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
      <Box
        sx={{
          position: "sticky",
          top: 16,
          zIndex: 1100,
          mb: 4,
          mx: "auto",
          maxWidth: 1200,
        }}
      >
        <FilterBar />
      </Box>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>{renderContent()}</Box>
      {isFetching && page > 1 && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress
            size={32}
            thickness={5}
            sx={{ color: "primary.main" }}
          />
        </Box>
      )}
    </Box>
  );
};
