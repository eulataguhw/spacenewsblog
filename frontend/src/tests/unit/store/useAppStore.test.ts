import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@store/useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const state = useAppStore.getState();
    state.setSearchQuery("");
    state.setStartDate(null);
    state.setEndDate(null);
    state.setPage(1);
    state.setSortOrder("published_at:desc");
  });

  it("should have initial empty state", () => {
    const state = useAppStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.startDate).toBeNull();
    expect(state.endDate).toBeNull();
    expect(state.page).toBe(1);
    expect(state.sortOrder).toBe("published_at:desc");
  });

  it("should update search query and reset page", () => {
    useAppStore.getState().setPage(2);
    useAppStore.getState().setSearchQuery("new search");

    const state = useAppStore.getState();
    expect(state.searchQuery).toBe("new search");
    expect(state.page).toBe(1);
  });

  it("should update dates and reset page", () => {
    useAppStore.getState().setPage(2);
    useAppStore.getState().setStartDate("2023-01-01");

    expect(useAppStore.getState().startDate).toBe("2023-01-01");
    expect(useAppStore.getState().page).toBe(1);

    useAppStore.getState().setPage(3);
    useAppStore.getState().setEndDate("2023-12-31");

    expect(useAppStore.getState().endDate).toBe("2023-12-31");
    expect(useAppStore.getState().page).toBe(1);
  });

  it("should update sort order and reset page", () => {
    useAppStore.getState().setPage(2);
    useAppStore.getState().setSortOrder("published_at:asc");

    const state = useAppStore.getState();
    expect(state.sortOrder).toBe("published_at:asc");
    expect(state.page).toBe(1);
  });

  it("should add multiple articles to the store", () => {
    const articles = [
      { id: "1", title: "Article 1" },
      { id: "2", title: "Article 2" },
    ] as any;

    useAppStore.getState().addArticles(articles);

    const state = useAppStore.getState();
    expect(state.articles["1"]).toEqual(articles[0]);
    expect(state.articles["2"]).toEqual(articles[1]);
  });

  it("should add a single article to the store", () => {
    const article = { id: "3", title: "Article 3" } as any;

    useAppStore.getState().addArticle(article);

    const state = useAppStore.getState();
    expect(state.articles["3"]).toEqual(article);
  });

  it("should merge new articles with existing ones", () => {
    useAppStore
      .getState()
      .addArticles([{ id: "1", title: "Article 1" }] as any);
    useAppStore.getState().addArticle({ id: "2", title: "Article 2" } as any);

    const state = useAppStore.getState();
    expect(state.articles["1"]).toBeDefined();
    expect(state.articles["2"]).toBeDefined();
  });
});
