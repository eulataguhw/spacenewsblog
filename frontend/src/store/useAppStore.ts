import { create } from "zustand";

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  sortOrder: "published_at:desc" | "published_at:asc";
  setSortOrder: (order: "published_at:desc" | "published_at:asc") => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  startDate: null,
  setStartDate: (date) => set({ startDate: date }),
  endDate: null,
  setEndDate: (date) => set({ endDate: date }),
  sortOrder: "published_at:desc",
  setSortOrder: (order) => set({ sortOrder: order }),
}));
