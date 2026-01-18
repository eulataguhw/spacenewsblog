import { create } from "zustand";
import { Article } from "@app-types/article";

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  sortOrder: "published_at:desc" | "published_at:asc";
  setSortOrder: (order: "published_at:desc" | "published_at:asc") => void;
  page: number;
  setPage: (pageUpdate: number | ((prev: number) => number)) => void;
  articles: Record<string, Article>;
  addArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  startDate: null,
  setStartDate: (date) => set({ startDate: date, page: 1 }),
  endDate: null,
  setEndDate: (date) => set({ endDate: date, page: 1 }),
  sortOrder: "published_at:desc",
  setSortOrder: (order) => set({ sortOrder: order, page: 1 }),
  page: 1,
  setPage: (pageUpdate) =>
    set((state) => ({
      page:
        typeof pageUpdate === "function" ? pageUpdate(state.page) : pageUpdate,
    })),
  articles: {},
  addArticles: (newArticles) =>
    set((state) => ({
      articles: {
        ...state.articles,
        ...newArticles.reduce(
          (acc, article) => ({ ...acc, [article.id]: article }),
          {},
        ),
      },
    })),
  addArticle: (article) =>
    set((state) => ({
      articles: {
        ...state.articles,
        [article.id]: article,
      },
    })),
}));
