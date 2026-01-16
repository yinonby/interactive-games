
import dotenv from "dotenv";
import type { ConfigContext, ExpoConfig } from "expo/config";

dotenv.config({ override: true, path: ".env" }); // load env file
dotenv.config({ override: true, path: `.env.game-ui.${process.env.NODE_ENV}` }); // load env-specific env file

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || "",
  slug: config.slug || "",
  extra: {
    ...config.extra,
    apiUrl: process.env.GAME_UI__API_URL,
    wssUrl: process.env.GAME_UI__WSS_URL,
    hh: "sadf"
  },
});
