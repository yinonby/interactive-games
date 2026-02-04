
import type { GamesTranslationKeyT } from '@ig/games-engine-ui-models';
import type { AppErrorCodeT } from './AppErrorTypes';

export type CommonTranslationKeyT =
  | "common:open"
  | "common:status"
  | "common:role"
  | "common:duration"
  | "common:minutes"
  | "common:unlimited"
  | "common:price"
  | "common:free"
  | "common:nickname"
  | "common:chat"
  | "common:copyLink"
  | "common:share"
  | "common:you"
;

export type AppTranslationKeyT = CommonTranslationKeyT | GamesTranslationKeyT | AppErrorCodeT;
