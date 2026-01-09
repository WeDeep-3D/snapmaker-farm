declare namespace NodeJS {
  interface ProcessEnv {
    DEV: boolean;
    PROD: boolean;
    DEBUGGING: boolean;
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
