
import type { GameInstanceExposedInfoT, PlayerExposedInfoT } from '../../src/types/game/GameInstanceTypes';
import type { GameStateT, LevelStateT } from '../../src/types/game/GameStateTypes';
import type {
  GameConfigT, MinimalGameConfigT,
} from '../../src/types/game/GameTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

export const buildTestMinimalGameConfig = (overrides?: Partial<MinimalGameConfigT>) => ({
  ...overrides
} as MinimalGameConfigT);

export const buildTestGameConfig = (overrides?: Partial<GameConfigT>) => ({
  ...overrides
} as GameConfigT);


const baseGameConfig: GameConfigT = {
  gameConfigId: 'gameConfigId1',
  kind: 'jointGame',
  gameName: 'gameName1',
  maxDurationInfo: { kind: 'unlimited' },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 2,
  imageInfo: { kind: 'url', imageUrl: 'imageUrl1' },
  extraTimeMinutes: 2,
  extraTimeLimitDurationInfo: { kind: 'unlimited' },
  levelExposedConfigs: [],
};

export const buildFullTestGameConfig = (overrides?: Partial<Omit<GameConfigT, 'imageAssetName'>>): GameConfigT => ({
  ...baseGameConfig,
  ...overrides,
});

export const buildTestGameInstanceExposedInfo = (overrides?: Partial<GameInstanceExposedInfoT>) => ({
  ...overrides
} as GameInstanceExposedInfoT);

export const buildTestPlayerExposedInfo = (overrides?: Partial<PlayerExposedInfoT>) => ({
  ...overrides
} as PlayerExposedInfoT);

export const buildTestGameState = (overrides?: Partial<GameStateT>) => ({
  ...overrides
} as GameStateT);

export const buildTestLevelState = (overrides?: Partial<LevelStateT>) => ({
  ...overrides
} as LevelStateT);
