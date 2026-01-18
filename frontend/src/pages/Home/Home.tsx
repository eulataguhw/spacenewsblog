import { Container, Box } from "@mui/material";
import { Typography } from "@components/atoms/Typography/Typography";
import { ArticleFeed } from "@components/templates/ArticleFeed/ArticleFeed";
import { EngagementMetrics } from "@components/organisms/EngagementMetrics/EngagementMetrics";
import { HOME_CONSTANTS } from "./constants";

import { ThemeSelector } from "@components/atoms/ThemeSelector/ThemeSelector";

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            {HOME_CONSTANTS.TITLE}
          </Typography>
          <ThemeSelector />
        </Box>

        <EngagementMetrics />

        <Box mt={4}>
          <ArticleFeed />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
