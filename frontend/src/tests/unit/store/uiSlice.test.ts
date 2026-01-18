import { describe, it, expect } from "vitest";
import uiReducer, {
  startLoading,
  stopLoading,
  setLoading,
} from "@store/uiSlice";

describe("uiSlice", () => {
  const initialState = {
    isLoading: false,
    pendingRequests: 0,
  };

  it("should handle initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle startLoading", () => {
    const actual = uiReducer(initialState, startLoading());
    expect(actual.isLoading).toBe(true);
    expect(actual.pendingRequests).toBe(1);
  });

  it("should handle multiple startLoading calls", () => {
    let state = uiReducer(initialState, startLoading());
    state = uiReducer(state, startLoading());
    expect(state.isLoading).toBe(true);
    expect(state.pendingRequests).toBe(2);
  });

  it("should handle stopLoading", () => {
    let state = { isLoading: true, pendingRequests: 1 };
    state = uiReducer(state, stopLoading());
    expect(state.isLoading).toBe(false);
    expect(state.pendingRequests).toBe(0);
  });

  it("should handle nested stopLoading", () => {
    let state = { isLoading: true, pendingRequests: 2 };
    state = uiReducer(state, stopLoading());
    expect(state.isLoading).toBe(true);
    expect(state.pendingRequests).toBe(1);

    state = uiReducer(state, stopLoading());
    expect(state.isLoading).toBe(false);
    expect(state.pendingRequests).toBe(0);
  });

  it("should prevent negative pendingRequests", () => {
    const state = uiReducer(initialState, stopLoading());
    expect(state.pendingRequests).toBe(0);
    expect(state.isLoading).toBe(false);
  });

  it("should handle setLoading(true)", () => {
    const state = uiReducer(initialState, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it("should handle setLoading(false) and reset pendingRequests", () => {
    let state = { isLoading: true, pendingRequests: 5 };
    state = uiReducer(state, setLoading(false));
    expect(state.isLoading).toBe(false);
    expect(state.pendingRequests).toBe(0);
  });
});
