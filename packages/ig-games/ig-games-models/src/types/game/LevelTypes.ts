
import type { GeoLocationCoordsT } from "@ig/lib";

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
