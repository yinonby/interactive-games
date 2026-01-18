
import type { GamesTranslationKeyT } from "@ig/engine-ui";
import type { CommonTranslationKeyT } from "@ig/engine-ui/src/types/CommonTranslationTypes";
import enCommonTranslationsJson from "../../assets/translations/en/common.json";
import enGamesTranslationsJson from "../../assets/translations/en/games.json";

type ExpandKeyT<K extends string> =
  K extends `${infer A}:${infer B}`
  ? { [Key in A]: ExpandKeyT<B> }
  : { [Key in K]: string };

type UnionToIntersectionT<U> =
  (U extends any ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never;

type CommonTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<CommonTranslationKeyT>>;

type GamesTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<GamesTranslationKeyT>>;

const enResource = {
  common: enCommonTranslationsJson,
  games: enGamesTranslationsJson,
} satisfies CommonTranslationShapeT & GamesTranslationShapeT;

export const getI18nResources = () => {
  return {
    en: enResource,
  }
}
