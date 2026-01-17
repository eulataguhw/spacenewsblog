import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "@components/molecules/FilterBar/FilterBar";
import { useAppStore } from "@store/useAppStore";

// Mock useAppStore
vi.mock("@store/useAppStore", () => ({
  useAppStore: vi.fn(),
}));

describe("FilterBar", () => {
  console.log("EXECUTING LATEST FILTERBAR TEST");
  const mockSetSearchQuery = vi.fn();
  const mockSetStartDate = vi.fn();
  const mockSetEndDate = vi.fn();
  const mockSetSortOrder = vi.fn();

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
    } as any);
  });

  it("renders all filter inputs", () => {
    render(<FilterBar />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();

    // MUI Select uses a div with role="combobox" that displays the selected value.
    // It should have the correct accessible name using the linked InputLabel.
    const sortSelect = screen.getByRole("combobox", { name: /Sort By/i });
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveTextContent(/Newest First/i);
  });

  it("calls date change handlers", () => {
    render(<FilterBar />);
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2023-12-31" } });

    expect(mockSetStartDate).toHaveBeenCalledWith("2023-01-01");
    expect(mockSetEndDate).toHaveBeenCalledWith("2023-12-31");
  });
});
