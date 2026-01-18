import { describe, it, expect, vi } from "vitest";
import { loadingMiddleware } from "@store/middleware/loadingMiddleware";
import { startLoading, stopLoading } from "@store/uiSlice";

// Mock helper functions from Redux Toolkit
vi.mock("@reduxjs/toolkit", async () => {
  const actual = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    isPending: (action: any) => action.type?.endsWith("/pending"),
    isFulfilled: (action: any) => action.type?.endsWith("/fulfilled"),
    isRejected: (action: any) => action.type?.endsWith("/rejected"),
  };
});

describe("loadingMiddleware", () => {
  const mockDispatch = vi.fn();
  const mockStore = { dispatch: mockDispatch } as any;
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should dispatch startLoading for pending actions", () => {
    const action = { type: "test/pending" };
    loadingMiddleware(mockStore)(next)(action);
    expect(mockDispatch).toHaveBeenCalledWith(startLoading());
    expect(next).toHaveBeenCalledWith(action);
  });

  it("should dispatch stopLoading for fulfilled actions", () => {
    const action = { type: "test/fulfilled" };
    loadingMiddleware(mockStore)(next)(action);
    expect(mockDispatch).toHaveBeenCalledWith(stopLoading());
    expect(next).toHaveBeenCalledWith(action);
  });

  it("should dispatch stopLoading for rejected actions", () => {
    const action = { type: "test/rejected" };
    loadingMiddleware(mockStore)(next)(action);
    expect(mockDispatch).toHaveBeenCalledWith(stopLoading());
    expect(next).toHaveBeenCalledWith(action);
  });

  it("should ignore other actions", () => {
    const action = { type: "test/other" };
    loadingMiddleware(mockStore)(next)(action);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });
});
