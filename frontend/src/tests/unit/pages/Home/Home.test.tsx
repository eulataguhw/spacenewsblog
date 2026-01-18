import { render, screen } from "@testing-library/react";
import Home from "@pages/Home/Home";

vi.mock("@components/templates/ArticleFeed/ArticleFeed", () => ({
  ArticleFeed: () => <div data-testid="article-feed">ArticleFeed</div>,
}));

vi.mock("@store/useAppStore", () => ({
  useAppStore: () => ({ setSearchQuery: vi.fn() }),
}));

describe("Home Page", () => {
  it("renders ArticleFeed", () => {
    render(<Home />);
    expect(screen.getByTestId("article-feed")).toBeInTheDocument();
    expect(screen.getByText("Latest News")).toBeInTheDocument();
  });
});
