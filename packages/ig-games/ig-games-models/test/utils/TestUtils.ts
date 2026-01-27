
import type { GameStateT } from '../../src/types/game/GameStateTypes';
import type {
  GameConfigT,
  GameInstanceExposedInfoT, MinimalGameConfigT,
  MinimalGameInstanceExposedInfoT,
  PlayerExposedInfoT
} from '../../src/types/game/GameTypes';

if (process.env.NODE_ENV !== "test") {
  throw new Error("TestUtils should only be used in testing");
}

export const buildTestMinimalGameConfig = (overrides: Partial<MinimalGameConfigT>) => ({
  ...overrides
} as MinimalGameConfigT);

export const buildTestGameConfig = (overrides: Partial<GameConfigT>) => ({
  ...overrides
} as GameConfigT);

export const buildTestMinimalGameInstanceExposedInfo = (
  overrides: Partial<MinimalGameInstanceExposedInfoT>
): MinimalGameInstanceExposedInfoT => ({
    ...overrides
} as MinimalGameInstanceExposedInfoT);

export const buildTestGameInstanceExposedInfo = (overrides: Partial<GameInstanceExposedInfoT>) => ({
  ...overrides
} as GameInstanceExposedInfoT);

export const buildTestPlayerExposedInfo = (overrides: Partial<PlayerExposedInfoT>) => ({
  ...overrides
} as PlayerExposedInfoT);

export const buildTestGameState = (overrides: Partial<GameStateT>) => ({
  ...overrides
} as GameStateT);
