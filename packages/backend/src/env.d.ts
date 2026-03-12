declare module 'bun' {
  interface Env {
    DATABASE_URL: string
    BACKEND_ID?: string
  }
}
