declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_WARGAMING_APP_ID: string;
    NEXT_PUBLIC_REDIRECT_URI: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
