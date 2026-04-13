type EnvConfig = {
  trendSourceUrl: string;
  openAiApiKey: string;
  imageApiKey: string;
  publishApiKey: string;
  publishApiUrl: string;
  cronSecret: string;
};

function getEnvValue(key: string): string {
  return process.env[key] ?? "";
}

export function getEnv(): EnvConfig {
  return {
    trendSourceUrl: getEnvValue("TREND_SOURCE_URL"),
    openAiApiKey: getEnvValue("OPENAI_API_KEY"),
    imageApiKey: getEnvValue("IMAGE_API_KEY"),
    publishApiKey: getEnvValue("PUBLISH_API_KEY"),
    publishApiUrl: getEnvValue("PUBLISH_API_URL"),
    cronSecret: getEnvValue("CRON_SECRET")
  };
}
