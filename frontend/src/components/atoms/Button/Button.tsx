import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ButtonProps, useModel } from "./useModel";
import { BUTTON_CONSTANTS } from "./constants";

import { Typography } from "@components/atoms/Typography/Typography";

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "rounded",
})<ButtonProps>(({ rounded }) => ({
  borderRadius: rounded
    ? BUTTON_CONSTANTS.ROUNDED_BORDER_RADIUS
    : BUTTON_CONSTANTS.DEFAULT_BORDER_RADIUS,
  padding: "8px 24px",
}));

export const Button = (props: ButtonProps) => {
  const model = useModel(props);
  return (
    <StyledButton {...model}>
      <Typography variant="inherit" component="span">
        {model.children}
      </Typography>
    </StyledButton>
  );
};
