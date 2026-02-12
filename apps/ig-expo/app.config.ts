
import dotenv from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';

dotenv.config({ override: true, path: "../../.env" }); // load env file
dotenv.config({ override: true, path: `../../.env.${process.env.NODE_ENV}` }); // load env-specific env file

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || "",
  slug: config.slug || "",
  extra: {
    ...config.extra,
    env: {
      appUrl: process.env.IG_ENV__WEB__BASE_URL,
      apiUrl: process.env.IG_ENV__API__BASE_URL,
      wssUrl: process.env.IG_ENV__WSS__BASE_URL,
    },
  },
});
