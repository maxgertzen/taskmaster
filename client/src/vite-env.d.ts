/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_IS_AUTH0_DISABLED: string;
  readonly VITE_MOCK_USER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
