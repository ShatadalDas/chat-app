declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      PORT: string;
      SOCKET_URL: string;
      JWT_SECRET: string;
    }
  }
}

export {};
