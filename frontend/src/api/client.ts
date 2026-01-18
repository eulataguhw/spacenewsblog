const importMetaEnv = import.meta.env;
const BASE_URL = `${importMetaEnv.VITE_NODE_SERVER_URL}:${importMetaEnv.VITE_NODE_SERVER_PORT}/${importMetaEnv.VITE_ARTICLE_API}`;

export const client = async (
  endpoint: string,
  { body, ...customConfig }: RequestInit = {},
) => {
  const headers = { "Content-Type": "application/json" };
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Network response was not ok");
  }

  return response.json();
};
