
import type { GeoLocationCoordsT } from "../lib/CommonTypes";

// level

export type LevelConfigT = {
  levelName?: string,
} & (
  GeoLocationPuzzleConfigT
);

export type GeoLocationPuzzleConfigT = {
  levelName: string,
  kind: "geo-location-puzzle",
  initialMapCenter: GeoLocationCoordsT,
  initialMapRadiusMeters: number,
}
