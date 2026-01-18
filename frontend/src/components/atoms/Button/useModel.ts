import { ButtonProps as MuiButtonProps } from "@mui/material";

export interface ButtonProps extends MuiButtonProps {
  rounded?: boolean;
}

export const useModel = (props: ButtonProps) => {
  return { ...props };
};
