import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONSTANTS } from "./constants";

const importMetaEnv = import.meta.env;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${importMetaEnv.VITE_NODE_SERVER_URL}:${importMetaEnv.VITE_NODE_SERVER_PORT}/${importMetaEnv.VITE_ARTICLE_API}`,
    timeout: 15000,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Article", "Comment"],
  keepUnusedDataFor: API_CONSTANTS.CACHE_TTL_SECONDS,
  endpoints: () => ({}),
});
