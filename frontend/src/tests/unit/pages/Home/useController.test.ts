import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useController } from "@pages/Home/useController";
import * as AppStore from "@store/useAppStore";

vi.mock("@store/useAppStore", () => ({
  useAppStore: vi.fn(),
}));

describe("Home/useController", () => {
  const mockSetSearchQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AppStore.useAppStore).mockReturnValue({
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "",
      startDate: null,
      endDate: null,
      sortOrder: "published_at:desc",
      setStartDate: vi.fn(),
      setEndDate: vi.fn(),
      setSortOrder: vi.fn(),
      page: 1,
      setPage: vi.fn(),
      articles: {},
      addArticles: vi.fn(),
      addArticle: vi.fn(),
    } as any);
  });

  it("should return setSearchQuery from the store", () => {
    const { result } = renderHook(() => useController());

    expect(result.current.setSearchQuery).toBe(mockSetSearchQuery);
  });

  it("should call setSearchQuery when invoked", () => {
    const { result } = renderHook(() => useController());

    result.current.setSearchQuery("test query");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("test query");
    expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
  });

  it("should access the store on mount", () => {
    renderHook(() => useController());

    expect(AppStore.useAppStore).toHaveBeenCalled();
  });
});
