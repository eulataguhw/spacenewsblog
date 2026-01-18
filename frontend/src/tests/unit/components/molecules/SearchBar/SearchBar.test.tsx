import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@components/molecules/SearchBar/SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder", () => {
    render(<SearchBar onSearch={() => {}} placeholder="Find something" />);
    expect(screen.getByPlaceholderText("Find something")).toBeInTheDocument();
  });

  it("calls onSearch with debounced value", async () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "space");

    await waitFor(
      () => {
        expect(handleSearch).toHaveBeenCalledWith("space");
      },
      { timeout: 1000 },
    );
  });

  it("initializes with initialValue", () => {
    render(<SearchBar onSearch={() => {}} initialValue="initial" />);
    expect(screen.getByDisplayValue("initial")).toBeInTheDocument();
  });
});
