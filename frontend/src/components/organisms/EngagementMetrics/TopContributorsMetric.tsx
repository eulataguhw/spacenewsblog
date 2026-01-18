import { Box, Typography, Grid, Paper } from "@mui/material";

interface TopContributorsMetricProps {
  model: {
    label: string;
    items: {
      username: string;
      commentCount: number;
    }[];
  };
}

export const TopContributorsMetric = ({
  model,
}: TopContributorsMetricProps) => (
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
    <Grid container spacing={1}>
      {model.items.map((user) => (
        <Grid size={{ xs: 12 }} key={user.username}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={600}>
              {user.username}
            </Typography>
            <Paper
              sx={{
                px: 1,
                py: 0.5,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" fontWeight={700}>
                {user.commentCount}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
