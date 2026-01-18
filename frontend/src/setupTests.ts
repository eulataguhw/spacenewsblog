import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

vi.mock("react-i18next", () => {
  const enTranslations = {
    app: {
      title: "SpaceBlog",
      description: "Latest news from the space industry",
    },
    home: {
      title: "Latest News",
      searchPlaceholder: "Search articles...",
    },
    search: {
      placeholder: "Search articles...",
    },
    filterBar: {
      startDate: "Start Date",
      endDate: "End Date",
      sortBy: "Sort By",
      sortOptions: {
        newestFirst: "Newest First",
        oldestFirst: "Oldest First",
      },
    },
    articles: {
      loadMore: "Load More",
      noArticles: "No articles found",
      readMore: "Read More",
      error: "Failed to load articles.",
    },
  };

  return {
    useTranslation: () => {
      console.log("useTranslation mock called");
      return {
        t: (key: string) => {
          // Simple nested key lookup for mocking
          const keys = key.split(".");
          let value: any = enTranslations;
          for (const k of keys) {
            value = value?.[k];
          }
          return value || key;
        },
        i18n: {
          changeLanguage: () => new Promise(() => {}),
          exists: (key: string) => {
            const keys = key.split(".");
            let value: any = enTranslations;
            for (const k of keys) {
              value = value?.[k];
              if (value === undefined) return false;
            }
            return true;
          },
          language: "en",
        },
        ready: true,
      };
    },
    initReactI18next: {
      type: "3rdParty",
      init: () => {},
    },
  };
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  static instances: IntersectionObserverMock[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    IntersectionObserverMock.instances.push(this);
  }

  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}

  // Helper to trigger intersection
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as any);
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// Runs a cleanup after each test case
afterEach(() => {
  IntersectionObserverMock.instances = [];
});
