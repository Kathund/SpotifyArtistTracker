declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_TOKEN: string;
    LOGS_CHANNEL: string;
    SPOTIFY_CLIENT_ID: string;
    PORT: string;
    MONGO_URL: string;
  }
}
