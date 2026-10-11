/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_PRODUCTS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
