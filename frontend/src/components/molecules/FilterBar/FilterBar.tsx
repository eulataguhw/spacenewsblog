import {
  Box,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SearchBar } from "@components/molecules/SearchBar/SearchBar";
import { useController } from "./useController";
import { FILTER_BAR_CONSTANTS } from "./constants";

export const FilterBar = () => {
  const {
    handleSearch,
    startDate,
    handleStartDateChange,
    endDate,
    handleEndDateChange,
    sortOrder,
    handleSortChange,
  } = useController();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mb: 4,
        alignItems: "center",
      }}
    >
      <Box sx={{ flex: 2, width: { xs: "100%", md: "auto" } }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flex: 3,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label={FILTER_BAR_CONSTANTS.START_DATE_LABEL}
          type="date"
          value={startDate || ""}
          onChange={handleStartDateChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1, minWidth: "150px" }}
        />
        <TextField
          label={FILTER_BAR_CONSTANTS.END_DATE_LABEL}
          type="date"
          value={endDate || ""}
          onChange={handleEndDateChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1, minWidth: "150px" }}
        />
        <FormControl sx={{ flex: 1, minWidth: "150px" }}>
          <InputLabel id="sort-order-label">
            {FILTER_BAR_CONSTANTS.SORT_LABEL}
          </InputLabel>
          <Select
            labelId="sort-order-label"
            id="sort-order-select"
            value={sortOrder}
            label={FILTER_BAR_CONSTANTS.SORT_LABEL}
            onChange={handleSortChange}
          >
            {FILTER_BAR_CONSTANTS.SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
