export const SPACE_NEWS_API = {
  BASE_URL: "https://api.spaceflightnewsapi.net/v4",
  ENDPOINTS: {
    ARTICLES: "/articles",
    BLOGS: "/blogs",
    REPORTS: "/reports",
  },
  TIMEOUT: 10000, // 10 seconds
  DEFAULT_LIMIT: 20,
} as const;
