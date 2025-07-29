/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_URL_HTTP: string
  readonly VITE_API_URL_HTTPS?: string
  // Add other custom environment variables as needed
} 