import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

const getDesignTokens = (mode: "default" | "black") => ({
  palette: {
    mode: "dark" as const,
    ...(mode === "default"
      ? {
          // Default Theme (Slate/Cyan)
          primary: {
            main: "#06b6d4",
            light: "#67e8f9",
            dark: "#0891b2",
            contrastText: "#ffffff",
          },
          background: {
            default: "#020617", // Slate 950
            paper: "rgba(30, 41, 59, 0.7)", // Slate 800 with transparency
          },
        }
      : {
          // Black Theme
          primary: {
            // Let's stick to the requested "Black" feel.
            // Primary: White for high contrast on black.
            main: "#ffffff",
            light: "#a3a3a3",
            dark: "#ffffff",
            contrastText: "#000000",
          },
          secondary: {
            main: "#333333",
            light: "#666666",
            dark: "#000000",
            contrastText: "#ffffff",
          },
          background: {
            default: "#000000", // Pure Black
            paper: "#000000", // Pure Black paper
          },
          text: {
            primary: "#ffffff",
            secondary: "#a1a1aa",
          },
        }),
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "system-ui", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: mode === "default" ? "blur(16px)" : "none",
          border:
            mode === "default"
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid #333",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background:
            mode === "default"
              ? "rgba(15, 23, 42, 0.6)"
              : "rgba(20, 20, 20, 1)",
          "&:hover": {
            background:
              mode === "default"
                ? "rgba(15, 23, 42, 0.8)"
                : "rgba(30, 30, 30, 1)",
            borderColor:
              mode === "default"
                ? "rgba(6, 182, 212, 0.4)"
                : "rgba(255, 255, 255, 0.4)",
            boxShadow:
              mode === "default"
                ? "0 0 20px rgba(6, 182, 212, 0.15)"
                : "0 0 20px rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
        containedPrimary: {
          background:
            mode === "default"
              ? "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
              : "#ffffff",
          color: mode === "default" ? "#ffffff" : "#000000",
          "&:hover": {
            background:
              mode === "default"
                ? "linear-gradient(135deg, #22d3ee 0%, #60a5fa 100%)"
                : "#e5e5e5",
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor:
            mode === "default" ? "#334155 #020617" : "#333333 #000000",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "transparent",
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: mode === "default" ? "#334155" : "#333333",
            border:
              mode === "default" ? "2px solid #020617" : "2px solid #000000",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: mode === "default" ? "#475569" : "#555555",
            },
        },
      },
    },
  },
});

export const createAppTheme = (mode: "default" | "black") =>
  createTheme(getDesignTokens(mode));
