
// these structures represent fields whose values have different kinds.
// they previously used XOR or mixed-types (number | string) to represent those, which in plain typescript is ok.
// however, when moving on to using DB and GraphQL schemas, such mixings make schemas much harder to deal with.
// the types below keep the business-logic structures rich, while facilitating a simple structure for schemas.

import type { AppImageAssetT } from '@ig/engine-models';

export type ImageInfoT = {
  kind: 'asset',
  imageAssetName: AppImageAssetT,
} | {
  kind: 'url',
  imageUrl: string,
}

export type DurationInfoT = {
  kind: 'limited',
  durationMs: number,
} | {
  kind: 'unlimited',
}

export type PriceInfoT = {
  kind: 'notFree',
  priceRate: number,
  priceCurrency: CurrencyT,
} | {
  kind: 'free',
}

export type CurrencyT = 'EUR' | 'USD';
export const currencyToSymbol: Record<CurrencyT, string> = {
  'USD': '$',
  'EUR': '€',
}

