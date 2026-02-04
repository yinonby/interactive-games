
import dotenv from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';

dotenv.config({ override: true, path: ".env.ig-expo" }); // load env file
dotenv.config({ override: true, path: `.env.ig-expo.${process.env.NODE_ENV}` }); // load env-specific env file

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || "",
  slug: config.slug || "",
  extra: {
    ...config.extra,
    env: {
      apiUrl: process.env.IG_EXPO__API_URL,
      wssUrl: process.env.IG_EXPO__WSS_URL,
      appUrl: process.env.IG_EXPO__APP_URL,
    },
  },
});
