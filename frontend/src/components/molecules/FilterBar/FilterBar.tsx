import { useTranslation } from "react-i18next";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { SearchBar } from "@components/molecules/SearchBar/SearchBar";
import { useController } from "./useController";
import { FILTER_BAR_CONSTANTS } from "./constants";

export const FilterBar = () => {
  const { t: translation } = useTranslation();
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
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
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
          <DatePicker
            label={translation(FILTER_BAR_CONSTANTS.START_DATE_LABEL)}
            value={startDate ? dayjs(startDate) : null}
            onChange={handleStartDateChange}
            slotProps={{ textField: { sx: { flex: 1, minWidth: "150px" } } }}
          />
          <DatePicker
            label={translation(FILTER_BAR_CONSTANTS.END_DATE_LABEL)}
            value={endDate ? dayjs(endDate) : null}
            onChange={handleEndDateChange}
            maxDate={dayjs()}
            slotProps={{ textField: { sx: { flex: 1, minWidth: "150px" } } }}
          />
          <FormControl sx={{ flex: 1, minWidth: "150px" }}>
            <InputLabel id="sort-order-label">
              {translation(FILTER_BAR_CONSTANTS.SORT_LABEL)}
            </InputLabel>
            <Select
              labelId="sort-order-label"
              id="sort-order-select"
              value={sortOrder}
              label={translation(FILTER_BAR_CONSTANTS.SORT_LABEL)}
              onChange={handleSortChange}
            >
              {FILTER_BAR_CONSTANTS.SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {translation(option.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Paper>
  );
};
