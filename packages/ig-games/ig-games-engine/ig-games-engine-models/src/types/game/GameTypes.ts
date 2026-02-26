
import type { DurationInfoT, ImageInfoT, PriceInfoT } from './CommonTypes';
import type { LevelExposedConfigT } from './LevelTypes';

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
  levelExposedConfigs: LevelExposedConfigT[],
}

// internal structures exposed for admin clients

export type GameConfigT = PublicGameConfigT & {
  fixedGameSolution?: FixedGameSolutionT,
}

export type GameConfigNoIdT = Omit<GameConfigT, 'gameConfigId'>;

export type FixedGameSolutionT = {
  kind: 'textSolution',
};
