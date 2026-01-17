import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useModel, SearchBarProps } from "./useModel";
import { SEARCH_BAR_CONSTANTS } from "./constants";

export const useController = (props: SearchBarProps) => {
  const { value, setValue } = useModel(props);
  const { onSearch } = props;
  const debouncedValue = useDebounce(value, SEARCH_BAR_CONSTANTS.DEBOUNCE_TIME);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return {
    value,
    handleChange,
    placeholder: props.placeholder,
  };
};
