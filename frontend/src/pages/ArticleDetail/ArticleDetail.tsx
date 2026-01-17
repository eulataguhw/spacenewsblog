import { Container, Typography, Box, Button } from "@mui/material";
import { useController } from "./useController";
import { ARTICLE_DETAIL_CONSTANTS } from "./constants";

const ArticleDetail = () => {
  const { id, handleBackClick } = useController();

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Button onClick={handleBackClick} variant="outlined" sx={{ mb: 2 }}>
          {ARTICLE_DETAIL_CONSTANTS.BACK_BUTTON}
        </Button>
        <Typography variant="h4">
          {ARTICLE_DETAIL_CONSTANTS.TITLE_PREFIX} {id}
        </Typography>
        <Typography variant="body1">
          {ARTICLE_DETAIL_CONSTANTS.CONTENT_PLACEHOLDER}
        </Typography>
      </Box>
    </Container>
  );
};

export default ArticleDetail;
