
import type { GamesTranslationKeyT } from "@ig/engine-ui";
import enGamesTranslationsJson from "../../assets/translations/en/games.json";

type ExpandKeyT<K extends string> =
  K extends `${infer A}:${infer B}`
  ? { [Key in A]: ExpandKeyT<B> }
  : { [Key in K]: string };

type UnionToIntersectionT<U> =
  (U extends any ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never;

type GamesTranslationShapeT =
  UnionToIntersectionT<ExpandKeyT<GamesTranslationKeyT>>;

const enGamesResource = enGamesTranslationsJson satisfies GamesTranslationShapeT;

export const getI18nResources = () => {
  return {
    en: enGamesResource,
  }
}
