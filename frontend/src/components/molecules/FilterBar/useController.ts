import { Dayjs } from "dayjs";
import { useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useModel } from "./useModel";

export const useController = () => {
  const {
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortOrder,
    setSortOrder,
  } = useModel();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery],
  );

  const handleStartDateChange = useCallback(
    (date: Dayjs | null) => {
      setStartDate(date ? date.format("YYYY-MM-DDTHH:mm:ss") : null);
    },
    [setStartDate],
  );

  const handleEndDateChange = useCallback(
    (date: Dayjs | null) => {
      setEndDate(date ? date.format("YYYY-MM-DDTHH:mm:ss") : null);
    },
    [setEndDate],
  );

  const handleSortChange = useCallback(
    (e: SelectChangeEvent) => {
      setSortOrder(e.target.value as "published_at:desc" | "published_at:asc");
    },
    [setSortOrder],
  );

  return {
    searchQuery,
    handleSearch,
    startDate,
    handleStartDateChange,
    endDate,
    handleEndDateChange,
    sortOrder,
    handleSortChange,
  };
};
