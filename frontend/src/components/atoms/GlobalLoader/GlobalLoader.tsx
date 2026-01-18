import { Backdrop, CircularProgress } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const GlobalLoader = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  return (
    <Backdrop
      sx={(theme) => ({
        color: "primary.main",
        zIndex: theme.zIndex.drawer + 2,
        backgroundColor: "rgba(2, 6, 23, 0.8)",
        backdropFilter: "blur(20px)",
      })}
      open={isLoading}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))",
        }}
      />
    </Backdrop>
  );
};
