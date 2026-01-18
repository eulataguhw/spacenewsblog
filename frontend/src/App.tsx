import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@/styles/index.css";
import "@/i18n/i18n";
import Home from "@pages/Home/Home";
import ArticleDetail from "@pages/ArticleDetail/ArticleDetail";
import { GlobalLoader } from "@components/atoms/GlobalLoader/GlobalLoader";

import { ThemeContextProvider, useThemeContext } from "@/context/ThemeContext";
import { createAppTheme } from "@/styles/theme";

function AppContent() {
  const { themeMode } = useThemeContext();
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <GlobalLoader />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AppContent />
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

export default App;
