import { render, screen } from "@testing-library/react";
import Home from "@pages/Home/Home";

vi.mock("@components/templates/ArticleFeed/ArticleFeed", () => ({
  ArticleFeed: () => <div data-testid="article-feed">ArticleFeed</div>,
}));

vi.mock("@components/molecules/SearchBar/SearchBar", () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}));

vi.mock("@store/useAppStore", () => ({
  useAppStore: () => ({ setSearchQuery: vi.fn() }),
}));

describe("Home Page", () => {
  it("renders SearchBar and ArticleFeed", () => {
    render(<Home />);
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("article-feed")).toBeInTheDocument();
    expect(screen.getByText("Latest News")).toBeInTheDocument();
  });
});
