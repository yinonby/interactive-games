
import type { GameInstanceT, PublicGameInstanceT, PublicPlayerInfoT } from '../../src/types/game/GameInstanceTypes';
import type { CodeLevelStateT, GameStateT, LevelStateT, WordleLevelStateT } from '../../src/types/game/GameStateTypes';
import type {
  GameConfigNoIdT,
  GameConfigT,
  GameUserT,
  MinimalPublicGameConfigT,
  PublicGameConfigT,
  PublicGameUserT
} from '../../src/types/game/GameTypes';
import type { PublicCodeLevelConfigT, PublicLevelConfigT } from '../../src/types/game/LevelTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

// game user

const basePublicGameUser: PublicGameUserT = {
  gameUserId: 'USER1',
  joinedGameConfigIds: [],
};

export const buildPublicGameUserMock = (
  overrides?: Partial<PublicGameUserT>
): PublicGameUserT => ({
  ...basePublicGameUser,
  ...overrides,
});

const baseGameUser: GameUserT = {
  gameUserId: 'USER1',
  joinedGameConfigIds: [],
};

export const buildGameUserMock = (
  overrides?: Partial<GameUserT>
): GameUserT => ({
  ...baseGameUser,
  ...overrides,
});

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

// level config

const basePublicCodeLevelConfig: PublicCodeLevelConfigT = {
  kind: 'code',
  publicCodePuzzleConfig: {
    kind: 'alphabetic',
    codeLength: 1,
  }
}

const basePublicLevelConfig: PublicLevelConfigT = {
  levelName: 'LEVEL1',
  publicPluginConfig: basePublicCodeLevelConfig,
}

export const buildPublicLevelConfig = (
  overrides?: Partial<PublicLevelConfigT>
): PublicLevelConfigT => ({
  ...basePublicLevelConfig,
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

const baseGameState: GameStateT = {
  gameStatus: 'ended',
  levelStates: [],
}

export const buildGameStateMock = (
  overrides?: Partial<GameStateT>
): GameStateT => ({
  ...baseGameState,
  ...overrides,
});

const basePublicGameInstance: PublicGameInstanceT = {
  gameInstanceId: 'GI1',
  invitationCode: 'INT1',
  publicGameConfig: buildPublicGameConfigMock(),
  gameState: buildGameStateMock(),
  publicPlayerInfos: [],
};

export const buildPublicGameInstanceMock = (
  overrides?: Partial<PublicGameInstanceT>
): PublicGameInstanceT => ({
  ...basePublicGameInstance,
  ...overrides,
});

const baseGameInstance: GameInstanceT = {
  ...basePublicGameInstance,
}

export const buildGameInstanceMock = (
  overrides?: Partial<GameInstanceT>
): PublicGameInstanceT => ({
  ...baseGameInstance,
  ...overrides,
});

const baseLevelState: LevelStateT = {
  levelStatus: 'notStarted',
  pluginState: {
    kind: 'code',
    publicCodePuzzleConfig: {
      kind: 'alphabetic',
      codeLength: 5,
    },
    codeSolution: 'World',
  },
}

export const buildLevelStateMock = (
  overrides?: Partial<LevelStateT>
): LevelStateT => ({
  ...baseLevelState,
  ...overrides,
});

const baseCodeLevelState: CodeLevelStateT = {
  kind: 'code',
  publicCodePuzzleConfig: {
    kind: 'alphabetic',
    codeLength: 5,
  },
  codeSolution: 'World',
}

export const buildCodeLevelStateMock = (
  overrides?: Partial<CodeLevelStateT>
): CodeLevelStateT => ({
  ...baseCodeLevelState,
  ...overrides,
});

const baseWordleLevelState: WordleLevelStateT = {
  kind: 'wordle',
  publicWordleConfig: {
    langCode: 'en',
    wordLength: 5,
    difficulty: 'easy',
    allowedGuessesNum: 2,
  },
  publicWordleState: {
    guessDatas: [],
  },
  wordleSolution: 'World',
}

export const buildWordleLevelStateMock = (
  overrides?: Partial<WordleLevelStateT>
): WordleLevelStateT => ({
  ...baseWordleLevelState,
  ...overrides,
});
