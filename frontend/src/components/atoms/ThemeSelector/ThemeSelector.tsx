import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PaletteIcon from "@mui/icons-material/Palette";
import { useThemeContext } from "@/context/ThemeContext";

export const ThemeSelector = () => {
  const { themeMode, setThemeMode } = useThemeContext();

  const toggleTheme = () => {
    setThemeMode(themeMode === "default" ? "black" : "default");
  };

  return (
    <Tooltip
      title={
        themeMode === "default"
          ? "Switch to Black Theme"
          : "Switch to Default Theme"
      }
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "text.primary",
          border: "1px solid",
          borderColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)",
        }}
      >
        {themeMode === "default" ? <DarkModeIcon /> : <PaletteIcon />}
      </IconButton>
    </Tooltip>
  );
};
