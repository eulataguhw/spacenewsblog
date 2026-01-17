import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@store/useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.getState().setSearchQuery("");
  });

  it("should have initial empty searchQuery", () => {
    const state = useAppStore.getState();
    expect(state.searchQuery).toBe("");
  });

  it("should update searchQuery", () => {
    const newQuery = "space exploration";
    useAppStore.getState().setSearchQuery(newQuery);

    const state = useAppStore.getState();
    expect(state.searchQuery).toBe(newQuery);
  });

  it("should update startDate", () => {
    const date = "2023-01-01";
    useAppStore.getState().setStartDate(date);
    expect(useAppStore.getState().startDate).toBe(date);
  });

  it("should update endDate", () => {
    const date = "2023-12-31";
    useAppStore.getState().setEndDate(date);
    expect(useAppStore.getState().endDate).toBe(date);
  });

  it("should update sortOrder", () => {
    const order = "published_at:asc";
    useAppStore.getState().setSortOrder(order);
    expect(useAppStore.getState().sortOrder).toBe(order);
  });
});
