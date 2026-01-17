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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value || null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value || null);
  };

  const handleSortChange = (e: SelectChangeEvent) => {
    setSortOrder(e.target.value as "published_at:desc" | "published_at:asc");
  };

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
