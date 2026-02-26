
import type { PublicGameInstanceT, PublicPlayerInfoT } from '../../src/types/game/GameInstanceTypes';
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
  publicLevelConfigs: [],
};

const baseGameConfig: GameConfigT = {
  ...basePublicGameConfig,
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

export const buildTestGameInstanceExposedInfo = (overrides?: Partial<PublicGameInstanceT>) => ({
  ...overrides
} as PublicGameInstanceT);

export const buildTestPublicPlayerInfo = (overrides?: Partial<PublicPlayerInfoT>) => ({
  ...overrides
} as PublicPlayerInfoT);

export const buildTestGameState = (overrides?: Partial<GameStateT>) => ({
  ...overrides
} as GameStateT);

export const buildTestLevelState = (overrides?: Partial<LevelStateT>) => ({
  ...overrides
} as LevelStateT);

const basePublicGameInstance: PublicGameInstanceT = {
  gameInstanceId: 'GI1',
  invitationCode: 'INT1',
  publicGameConfig: buildPublicGameConfigMock(),
  gameState: buildTestGameState(),
  publicPlayerInfos: [buildTestPublicPlayerInfo()],
};

export const buildPublicGameInstanceMock = (
  overrides?: Partial<PublicGameInstanceT>
): PublicGameInstanceT => ({
  ...basePublicGameInstance,
  ...overrides,
});
