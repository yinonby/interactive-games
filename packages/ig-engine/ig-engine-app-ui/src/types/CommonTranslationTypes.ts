
import type { AppErrorCodeT } from "./AppErrorTypes";
import type { GamesTranslationKeyT } from "./GamesTranslationsTypes";

export type CommonTranslationKeyT =
  | "common:open"
  | "common:status"
  | "common:role"
  | "common:duration"
  | "common:minutes"
  | "common:price"
  | "common:free"
  | "common:nickname"
  | "common:chat"
  | "common:copyLink"
  | "common:share"
  | "common:you"
;

export type AppTranslationKeyT = CommonTranslationKeyT | GamesTranslationKeyT | AppErrorCodeT;
