
import type { DurationInfoT, ImageInfoT, PriceInfoT } from './CommonTypes';
import type { PublicLevelConfigT } from './LevelTypes';

export type GameConfigIdT = string;

export type MinimalPublicGameConfigT = {
  gameConfigId: GameConfigIdT,
  kind: 'jointGame',
  gameName: string,
  maxDurationInfo: DurationInfoT,
  gamePriceInfo: PriceInfoT,
  maxParticipants: number,
  imageInfo: ImageInfoT,
}

export type PublicGameConfigT = MinimalPublicGameConfigT & {
  extraTimeMinutes: number,
  extraTimeLimitDurationInfo: DurationInfoT,
  publicLevelConfigs: PublicLevelConfigT[],
}

// internal structures exposed for admin clients

export type GameConfigT = PublicGameConfigT;

export type GameConfigNoIdT = Omit<GameConfigT, 'gameConfigId'>;
