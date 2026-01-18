import {
  Container,
  Typography as MuiTypography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LaunchIcon from "@mui/icons-material/Launch";
import { useController } from "./useController";
import { Typography } from "@components/atoms/Typography/Typography";
import { CommentSection } from "@components/organisms/CommentSection/CommentSection";
import { ARTICLE_DETAIL_CONSTANTS } from "./constants";

const ArticleDetail = () => {
  const {
    id,
    article,
    comments,
    isLoading,
    isCommentsLoading,
    isError,
    handleBackClick,
  } = useController();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (isError || !article) {
    return (
      <Container maxWidth="md">
        <Box py={8} textAlign="center">
          <Typography variant="h4" color="error">
            {isError ? "Error loading article" : "Article not found"}
          </Typography>
          <Button onClick={handleBackClick} sx={{ mt: 4 }} variant="contained">
            {ARTICLE_DETAIL_CONSTANTS.BACK_BUTTON}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="page-transition">
      <Box py={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          variant="text"
          sx={{
            mb: 4,
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          {ARTICLE_DETAIL_CONSTANTS.BACK_BUTTON}
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 0,
            overflow: "hidden",
            background: "transparent",
            border: "none",
            backdropFilter: "none",
          }}
        >
          {article.image_url && (
            <Box
              component="img"
              src={article.image_url}
              alt={article.title}
              sx={{
                width: "100%",
                height: { xs: 300, md: 500 },
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                mb: 6,
              }}
            />
          )}

          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    {article.source}
                  </Typography>
                  <MuiTypography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    •
                  </MuiTypography>
                  <MuiTypography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {new Date(article.published_at).toLocaleDateString()}
                  </MuiTypography>
                </Stack>
                <Typography variant="h2" component="h1">
                  {article.title}
                </Typography>
              </Box>

              <Paper sx={{ p: 4 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.2rem",
                    lineHeight: 1.8,
                    color: "text.primary",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {article.summary}
                </Typography>

                <Box mt={6} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    href={article.url}
                    target="_blank"
                    endIcon={<LaunchIcon />}
                  >
                    Read Original Article
                  </Button>
                </Box>
              </Paper>

              <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.05)" }} />

              <Box id="comments-section" sx={{ pb: 8 }}>
                <CommentSection
                  articleId={id || ""}
                  comments={comments}
                  isLoading={isCommentsLoading}
                />
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ArticleDetail;
