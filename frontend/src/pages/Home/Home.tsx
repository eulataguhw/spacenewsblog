import { Container, Box, Typography } from "@mui/material";
import { ArticleFeed } from "@components/templates/ArticleFeed/ArticleFeed";
import { SearchBar } from "@components/molecules/SearchBar/SearchBar";
import { useController } from "./useController";
import { HOME_CONSTANTS } from "./constants";

const Home = () => {
  const { setSearchQuery } = useController();

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
          <Box width={{ xs: "100%", sm: 300 }}>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder={HOME_CONSTANTS.SEARCH_PLACEHOLDER}
            />
          </Box>
        </Box>
        <ArticleFeed />
      </Box>
    </Container>
  );
};

export default Home;
