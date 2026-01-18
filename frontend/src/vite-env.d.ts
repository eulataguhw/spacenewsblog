/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_NODE_SERVER_URL: string;
  readonly VITE_NODE_SERVER_PORT: string;
  readonly VITE_ARTICLE_API: string;
  readonly VITE_ARTICLE_ENDPOINT: string;
}
