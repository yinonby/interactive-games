
import type { GameInstanceExposedInfoT, PlayerExposedInfoT } from '../../src/types/game/GameInstanceTypes';
import type { GameStateT, LevelStateT } from '../../src/types/game/GameStateTypes';
import type {
  GameConfigNoIdT,
  GameConfigT,
  MinimalPublicGameConfigT,
  PublicGameConfigT
} from '../../src/types/game/GameTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

// game config

const baseMinimalPublicGameConfig: MinimalPublicGameConfigT = {
  gameConfigId: 'gameConfigId1',
  kind: 'jointGame',
  gameName: 'gameName1',
  maxDurationInfo: { kind: 'unlimited' },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 2,
  imageInfo: { kind: 'url', imageUrl: 'imageUrl1' },
};

const basePublicGameConfig: PublicGameConfigT = {
  ...baseMinimalPublicGameConfig,
  extraTimeMinutes: 2,
  extraTimeLimitDurationInfo: { kind: 'unlimited' },
  levelExposedConfigs: [],
};

const baseGameConfig: GameConfigT = {
  ...basePublicGameConfig,
    fixedGameSolution: {
      kind: 'textSolution',
    },
};

export const buildMinimalPublicGameConfigMock = (
  overrides?: Partial<MinimalPublicGameConfigT>
): MinimalPublicGameConfigT => ({
  ...baseMinimalPublicGameConfig,
  ...overrides,
});

export const buildPublicGameConfigMock = (
  overrides?: Partial<PublicGameConfigT>
): PublicGameConfigT => ({
  ...basePublicGameConfig,
  ...overrides,
});

export const buildGameConfigMock = (
  overrides?: Partial<GameConfigT>
): GameConfigT => ({
  ...baseGameConfig,
  ...overrides,
});

export const buildGameConfigNoIdMock = (
  overrides?: Partial<Omit<GameConfigNoIdT, 'imageAssetName'>>
): GameConfigNoIdT => ({
  ...baseGameConfig,
  ...overrides,
});

// game instance

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
