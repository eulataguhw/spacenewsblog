import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/store.ts";
import theme from "./styles/theme.ts";
import "./styles/index.css";
import "./i18n/i18n.ts";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        Root
      </ThemeProvider>
    </Provider>
  );
}

export default App;
