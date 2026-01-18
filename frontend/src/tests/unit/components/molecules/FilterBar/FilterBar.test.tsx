import { render, screen, fireEvent } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FilterBar } from "@components/molecules/FilterBar/FilterBar";
import dayjs from "dayjs";
import { useAppStore } from "@store/useAppStore";

vi.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: ({ label, value, onChange }: any) => (
    <div data-testid="mock-date-picker">
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="text"
        value={value ? value.format("YYYY-MM-DD") : ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val ? dayjs(val) : null);
        }}
        aria-label={label}
      />
    </div>
  ),
}));

// Mock useAppStore
vi.mock("@store/useAppStore", () => ({
  useAppStore: vi.fn(),
}));

describe("FilterBar", () => {
  const mockSetSearchQuery = vi.fn();
  const mockSetStartDate = vi.fn();
  const mockSetEndDate = vi.fn();
  const mockSetSortOrder = vi.fn();
  const mockSetPage = vi.fn();

  beforeEach(() => {
    vi.mocked(useAppStore).mockReturnValue({
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      startDate: null,
      setStartDate: mockSetStartDate,
      endDate: null,
      setEndDate: mockSetEndDate,
      sortOrder: "published_at:desc",
      setSortOrder: mockSetSortOrder,
      page: 1,
      setPage: mockSetPage,
    } as any);
  });

  const renderFilterBar = () =>
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FilterBar />
      </LocalizationProvider>,
    );

  it("renders all filter inputs", () => {
    renderFilterBar();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();

    const sortSelect = screen.getByRole("combobox", { name: /Sort By/i });
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveTextContent(/Newest First/i);
  });

  it("calls date change handlers", () => {
    renderFilterBar();
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2023-12-31" } });

    // useController formats it as "YYYY-MM-DDTHH:mm:ss"
    expect(mockSetStartDate).toHaveBeenCalledWith(
      expect.stringContaining("2023-01-01T"),
    );
    expect(mockSetEndDate).toHaveBeenCalledWith(
      expect.stringContaining("2023-12-31T"),
    );
  });
});
