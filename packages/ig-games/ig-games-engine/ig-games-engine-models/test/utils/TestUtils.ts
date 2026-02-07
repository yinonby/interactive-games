
import type { GameInstanceExposedInfoT, PlayerExposedInfoT } from '../../src/types/game/GameInstanceTypes';
import type { GameStateT, LevelStateT } from '../../src/types/game/GameStateTypes';
import type {
  GameConfigT,
  GameInfoNoIdT,
  GameInfoT, MinimalGameInfoT,
} from '../../src/types/game/GameTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

export const buildTestMinimalGameConfig = (overrides?: Partial<MinimalGameInfoT>) => ({
  ...overrides
} as MinimalGameInfoT);

export const buildTestGameInfo = (overrides?: Partial<GameInfoT>) => ({
  ...overrides
} as GameInfoT);

export const buildTestGameInfoNoId = (overrides?: Partial<GameInfoNoIdT>) => ({
  ...overrides
} as GameInfoNoIdT);

export const buildTestGameConfig = (overrides?: Partial<GameConfigT>) => ({
  ...overrides
} as GameConfigT);

const baseGameInfo: GameInfoT = {
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

export const buildFullTestGameInfo = (overrides?: Partial<Omit<GameInfoT, 'imageAssetName'>>): GameInfoT => ({
  ...baseGameInfo,
  ...overrides,
});

export const buildFullTestGameInfoNoId = (overrides?: Partial<Omit<GameInfoNoIdT, 'imageAssetName'>>): GameInfoNoIdT => ({
  ...baseGameInfo,
  ...overrides,
});

const baseGameConfig: GameConfigT = {
  gameConfigId: 'GCID1',
  gameInfoNoId: baseGameInfo,
}

export const buildFullTestGameConfig = (overrides?: Partial<GameConfigT>): GameConfigT => ({
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
