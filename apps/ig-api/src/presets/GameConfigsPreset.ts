/* istanbul ignore file -- @preserve */

import { GameConfigLogic } from '@ig/games-api/src/logic/game-config/GameConfigLogic';
import type { GameConfigLogicAdapter, GamesDbAdapter } from '@ig/games-be-models';
import type {
  GameConfigT
} from '@ig/games-models';
import { MIN_TO_MS } from '@ig/lib';

export const loadGameConfigPreset1 = async (gamesDbAdapter: GamesDbAdapter): Promise<void> => {
  const gameConfigLogicAdapter: GameConfigLogicAdapter = new GameConfigLogic(gamesDbAdapter.getGameConfigsTableAdapter());
  const gameConfigs: GameConfigT[] = [
    secretIslandGameConfig,
    escapeRoomGameConfig,
    wordleEnGameConfig,
    wordleFrGameConfig,
    wordleEsGameConfig,
  ];

  for (const gameConfig of gameConfigs) {
    await gameConfigLogicAdapter.createGameConfig(gameConfig);
  }
}

const secretIslandGameConfig: GameConfigT = {
  gameConfigId: 'treasure-hunt-secret-island', // this game is already joined in this dev preset
  kind: 'jointGame',
  gameName: 'Treasure Hunt - Secret Island',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'notFree', priceRate: 5, priceCurrency: 'EUR' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'treasure-hunt-1' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelConfigs: [],
}

const escapeRoomGameConfig: GameConfigT = {
  gameConfigId: 'escape-room-harry-potter',
  kind: 'jointGame',
  gameName: 'Escape Room - Harry Potter',
  maxDurationInfo: { kind: 'unlimited' },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'escape-room-1' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'unlimited' },
  levelConfigs: [],
}

const wordleEnGameConfig: GameConfigT = {
  gameConfigId: 'wordle-english',
  kind: 'jointGame',
  gameName: 'Wordle - English',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'wordle-1' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelConfigs: [],
}

const wordleEsGameConfig: GameConfigT = {
  gameConfigId: 'wordle-spanish',
  kind: 'jointGame',
  gameName: 'Wordle - Spanish',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'wordle-2' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelConfigs: [],
}

const wordleFrGameConfig: GameConfigT = {
  gameConfigId: 'wordle-french',
  kind: 'jointGame',
  gameName: 'Wordle - French',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'wordle-3' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelConfigs: [],
}

