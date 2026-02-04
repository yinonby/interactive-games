
import type { DurationInfoT, ImageInfoT, PriceInfoT } from './CommonTypes';
import type { LevelExposedConfigT } from './LevelTypes';

export type GameConfigIdT = string;

export type MinimalGameConfigT = {
  gameConfigId: GameConfigIdT,
  kind: 'jointGame',
  gameName: string,
  maxDurationInfo: DurationInfoT,
  gamePriceInfo: PriceInfoT,
  maxParticipants: number,
  imageInfo: ImageInfoT,
}

export type GameConfigT = MinimalGameConfigT & {
  extraTimeMinutes: number,
  extraTimeLimitDurationInfo: DurationInfoT,
  levelConfigs: LevelExposedConfigT[],
}
