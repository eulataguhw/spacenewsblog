import { render, screen } from "@testing-library/react";
import Home from "@pages/Home/Home";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@components/templates/ArticleFeed/ArticleFeed", () => ({
  ArticleFeed: () => <div data-testid="article-feed">ArticleFeed</div>,
}));

vi.mock("@store/useAppStore", () => ({
  useAppStore: () => ({ setSearchQuery: vi.fn() }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("Home Page", () => {
  it("renders ArticleFeed", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <Home />
        </ThemeContextProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("article-feed")).toBeInTheDocument();
    expect(screen.getByText("Latest News")).toBeInTheDocument();
  });
});
