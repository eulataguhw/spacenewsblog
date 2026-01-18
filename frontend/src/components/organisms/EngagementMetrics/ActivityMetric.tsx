import { Box, Typography } from "@mui/material";

interface ActivityMetricProps {
  model: {
    label: string;
    value: number;
    subLabel: string;
  };
}

export const ActivityMetric = ({ model }: ActivityMetricProps) => (
  <Box
    sx={{
      height: "100%",
      p: 2,
      borderRadius: 2,
      background: "rgba(255, 255, 255, 0.03)",
    }}
  >
    <Typography variant="overline" color="text.secondary">
      {model.label}
    </Typography>
    <Typography
      variant="h3"
      color="primary.main"
      sx={{ fontWeight: 800, mt: 1 }}
      data-testid="activity-metric-value"
    >
      {model.value}
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
        {model.subLabel}
      </Typography>
    </Typography>
  </Box>
);
