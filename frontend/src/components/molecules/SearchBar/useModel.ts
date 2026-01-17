import { useState } from "react";

export interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const useModel = ({ initialValue }: SearchBarProps) => {
  const [value, setValue] = useState(initialValue || "");
  return { value, setValue };
};
