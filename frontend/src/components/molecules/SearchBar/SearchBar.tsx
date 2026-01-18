import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@components/atoms/Input/Input";
import { useController } from "./useController";
import { SearchBarProps } from "./useModel";
import { SEARCH_BAR_CONSTANTS } from "./constants";

export const SearchBar = (props: SearchBarProps) => {
  const { value, handleChange, placeholder } = useController(props);

  return (
    <Input
      value={value}
      onChange={handleChange as any}
      placeholder={placeholder || SEARCH_BAR_CONSTANTS.DEFAULT_PLACEHOLDER}
      inputProps={{ "data-testid": "search-input" }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
