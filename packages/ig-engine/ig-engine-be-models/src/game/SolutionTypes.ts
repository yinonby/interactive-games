
// solution

import type { GeoLocationCoordsT } from "@ig/engine-models";

export type SolutionConfigT = TextualSolutionConfigT
  | NumericSolutionConfigT
  | GeoLocationSolutionConfigT;

export type TextualSolutionConfigT = {
  kind: "textual-solution",
  solutionValue: string,
}

export type NumericSolutionConfigT = {
  kind: "numeric-solution",
  solutionValue: number,
}

export type GeoLocationSolutionConfigT = {
  kind: "geo-location-solution",
  solutionValue: GeoLocationCoordsT,
}
