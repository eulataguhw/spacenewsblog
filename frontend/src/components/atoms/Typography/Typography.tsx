import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export interface TypographyProps extends MuiTypographyProps {
  children?: React.ReactNode;
}

export const Typography = ({ children, ...props }: TypographyProps) => {
  const { t: translation } = useTranslation();

  let content = children;

  // If children is a string, try to translate it
  if (typeof children === "string") {
    content = translation(children);
  }

  return (
    <MuiTypography
      {...props}
      sx={{
        ...(props.variant?.toString().startsWith("h") &&
        ["h1", "h2", "h3", "h4"].includes(props.variant.toString())
          ? {
              textShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
              background: "linear-gradient(to right, #ffffff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : {}),
        ...props.sx,
      }}
    >
      {content}
    </MuiTypography>
  );
};
