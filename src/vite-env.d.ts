/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_ADMIN_USER_ID?: string;
  readonly VITE_N8N_ADMIN_LEADS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
