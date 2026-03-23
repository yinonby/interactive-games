
import { getExpoEnvVars } from '@ig/env/expo';
import dotenv from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';

dotenv.config({ override: true, path: "../../.env" }); // load env file
dotenv.config({ override: true, path: `../../.env.${process.env.NODE_ENV}` }); // load env-specific env file

const expoEnvVars = getExpoEnvVars();
const { webBaseUrl, apiBaseUrl, wssBaseUrl } = expoEnvVars;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || "",
  slug: config.slug || "",
  extra: {
    ...config.extra,
    env: {
      appUrl: webBaseUrl,
      apiUrl: apiBaseUrl,
      wssUrl: wssBaseUrl,
      expoEnvVars: expoEnvVars,
    },
  },
});
