
import type { DurationInfoT, ImageInfoT, PriceInfoT } from './CommonTypes';
import type { LevelExposedConfigT } from './LevelTypes';

export type GameConfigIdT = string;

export type MinimalGameInfoT = {
  gameConfigId: GameConfigIdT,
  kind: 'jointGame',
  gameName: string,
  maxDurationInfo: DurationInfoT,
  gamePriceInfo: PriceInfoT,
  maxParticipants: number,
  imageInfo: ImageInfoT,
}

export type GameInfoT = MinimalGameInfoT & {
  extraTimeMinutes: number,
  extraTimeLimitDurationInfo: DurationInfoT,
  levelExposedConfigs: LevelExposedConfigT[],
}

export type MinimalGameInfoNoIdT = Omit<MinimalGameInfoT, 'gameConfigId'>;
export type GameInfoNoIdT = Omit<GameInfoT, 'gameConfigId'>;

export type GameConfigT = {
  gameConfigId: GameConfigIdT,
  gameInfoNoId: GameInfoNoIdT,
}