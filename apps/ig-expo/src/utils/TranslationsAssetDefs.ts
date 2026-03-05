
import type {
  AppErrorCodeT, CommonTranslationKeyT,
} from '@ig/app-engine-ui';
import type { AuthTranslationKeyT } from '@ig/auth-ui-models';
import type { GamesTranslationKeyT } from '@ig/games-engine-ui-models';
import enAuthTranslationsJson from '../../assets/translations/en/auth.json';
import enCommonTranslationsJson from '../../assets/translations/en/common.json';
import enErrosTranslationsJson from '../../assets/translations/en/errors.json';
import enGamesTranslationsJson from '../../assets/translations/en/games.json';

type ExpandKeyT<K extends string> =
  K extends `${infer A}:${infer B}`
  ? { [Key in A]: ExpandKeyT<B> }
  : { [Key in K]: string };

type UnionToIntersectionT<U> =
  (U extends any ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never;

type CommonTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<CommonTranslationKeyT>>;

type AuthTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<AuthTranslationKeyT>>;

type GamesTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<GamesTranslationKeyT>>;

type ErrorTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<AppErrorCodeT>>;

const enResource = {
  apiError: enErrosTranslationsJson.apiError,
  engineApiError: enErrosTranslationsJson.engineApiError,
  gamesApiError: enErrosTranslationsJson.gamesApiError,
  appError: enErrosTranslationsJson.appError,
  common: enCommonTranslationsJson,
  auth: enAuthTranslationsJson,
  games: enGamesTranslationsJson,
} satisfies CommonTranslationShapeT & AuthTranslationShapeT & GamesTranslationShapeT & ErrorTranslationShapeT;

export const getI18nResources = () => {
  return {
    en: enResource,
  }
}
