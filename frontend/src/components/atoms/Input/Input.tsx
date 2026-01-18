import { TextField, TextFieldProps, styled } from "@mui/material";
import { useModel } from "./useModel";
import { INPUT_CONSTANTS } from "./constants";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: INPUT_CONSTANTS.BORDER_RADIUS,
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const Input = (props: TextFieldProps) => {
  const model = useModel(props);
  return <StyledTextField variant="outlined" fullWidth {...model} />;
};
