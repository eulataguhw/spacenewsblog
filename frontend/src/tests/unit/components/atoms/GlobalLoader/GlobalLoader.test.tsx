import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GlobalLoader } from "@components/atoms/GlobalLoader/GlobalLoader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ReactQuery from "@tanstack/react-query";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useIsFetching: vi.fn(),
    useIsMutating: vi.fn(),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("GlobalLoader", () => {
  it("should not render when isLoading is false", () => {
    vi.mocked(ReactQuery.useIsFetching).mockReturnValue(0);
    vi.mocked(ReactQuery.useIsMutating).mockReturnValue(0);

    renderWithQueryClient(<GlobalLoader />);

    expect(ReactQuery.useIsFetching).toHaveBeenCalled();
    expect(ReactQuery.useIsMutating).toHaveBeenCalled();
  });

  it("should render when isLoading is true", () => {
    vi.mocked(ReactQuery.useIsFetching).mockReturnValue(1);
    vi.mocked(ReactQuery.useIsMutating).mockReturnValue(0);

    renderWithQueryClient(<GlobalLoader />);
    expect(
      screen.getByRole("progressbar", { hidden: true }),
    ).toBeInTheDocument();
  });
});
