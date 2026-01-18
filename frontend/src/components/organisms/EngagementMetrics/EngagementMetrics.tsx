import { Box, Paper, CircularProgress, Grid } from "@mui/material";
import { Typography } from "@components/atoms/Typography/Typography";
import { useModel } from "./useModel";
import { ActivityMetric } from "./ActivityMetric";
import { TopArticlesMetric } from "./TopArticlesMetric";
import { TopContributorsMetric } from "./TopContributorsMetric";

export const EngagementMetrics = () => {
  const { models, isLoading, error, title } = useModel();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !models) {
    return null; // Fail gracefully
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        background: "rgba(30, 41, 59, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        {title}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ActivityMetric model={models.activityModel} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TopArticlesMetric model={models.articlesModel} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TopContributorsMetric model={models.contributorsModel} />
        </Grid>
      </Grid>
    </Paper>
  );
};
