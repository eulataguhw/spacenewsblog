import { SPACE_NEWS_API } from "../constants/apiConstants";
import type {
  SpaceNewsApiResponse,
  SpaceNewsArticle,
  ArticleQueryParams,
} from "../types/spaceNewsTypes";

/**
 * Fetch articles from Space Flight News API v4 with pagination and filtering
 */
export const getArticles = async (
  params: ArticleQueryParams = {},
): Promise<SpaceNewsApiResponse> => {
  const queryParams = new URLSearchParams();

  // Add pagination parameters
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.offset) queryParams.append("offset", params.offset.toString());

  // Add filter parameters
  if (params.search) queryParams.append("search", params.search);
  if (params.news_site) queryParams.append("news_site", params.news_site);
  if (params.has_event !== undefined)
    queryParams.append("has_event", params.has_event.toString());
  if (params.has_launch !== undefined)
    queryParams.append("has_launch", params.has_launch.toString());
  if (params.published_at_gte)
    queryParams.append("published_at_gte", params.published_at_gte);
  if (params.published_at_lte)
    queryParams.append("published_at_lte", params.published_at_lte);
  if (params.ordering) queryParams.append("ordering", params.ordering);

  const url = `${SPACE_NEWS_API.BASE_URL}${SPACE_NEWS_API.ENDPOINTS.ARTICLES}?${queryParams.toString()}`;

  const fetchWithRetry = async (
    attempts: number = 3,
  ): Promise<SpaceNewsApiResponse> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn(`Request timed out for URL: ${url}`);
        controller.abort();
      }, SPACE_NEWS_API.TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          Connection: "keep-alive",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        console.error(`API Error Response: ${text}`);
        throw new Error(
          `Space News API error: ${response.status} ${response.statusText}`,
        );
      }

      const data: SpaceNewsApiResponse = await response.json();
      return data;
    } catch (error) {
      if (
        attempts > 1 &&
        error instanceof Error &&
        (error.name === "TypeError" || (error as any).code === "ECONNRESET")
      ) {
        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchWithRetry(attempts - 1);
      }

      console.error(`Fetch error for ${url}:`, error);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request to Space News API timed out");
        }
        throw new Error(`Failed to fetch articles: ${error.message}`);
      }
      throw new Error("Failed to fetch articles from Space News API");
    }
  };

  return fetchWithRetry();
};

/**
 * Fetch a single article by ID
 */
export const getArticleById = async (id: number): Promise<SpaceNewsArticle> => {
  const url = `${SPACE_NEWS_API.BASE_URL}${SPACE_NEWS_API.ENDPOINTS.ARTICLES}/${id}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      SPACE_NEWS_API.TIMEOUT,
    );

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      throw new Error(
        `Space News API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: SpaceNewsArticle = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request to Space News API timed out");
      }
      throw error;
    }
    throw new Error("Failed to fetch article from Space News API");
  }
};
