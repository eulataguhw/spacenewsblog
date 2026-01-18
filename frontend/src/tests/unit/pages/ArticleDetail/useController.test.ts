import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useController } from "@pages/ArticleDetail/useController";
import { useNavigate, useParams } from "react-router-dom";
import { useModel } from "@pages/ArticleDetail/useModel";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

// Mock useModel
vi.mock("@pages/ArticleDetail/useModel", () => ({
  useModel: vi.fn(),
}));

describe("ArticleDetail/useController", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("should return article data processing logic from useModel", () => {
    vi.mocked(useParams).mockReturnValue({ id: "123" });
    vi.mocked(useModel).mockReturnValue({
      id: "123",
      article: { id: "123", title: "Test" } as any,
      comments: [],
      isLoading: false,
      isCommentsLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useController());

    expect(result.current.id).toBe("123");
    expect(result.current.article).toEqual({ id: "123", title: "Test" });
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle back navigation", () => {
    vi.mocked(useParams).mockReturnValue({ id: "123" });
    vi.mocked(useModel).mockReturnValue({} as any);

    const { result } = renderHook(() => useController());

    act(() => {
      result.current.handleBackClick();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
