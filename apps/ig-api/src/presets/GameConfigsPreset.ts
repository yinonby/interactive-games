/* istanbul ignore file -- @preserve */

import { GameConfigLogic } from '@ig/games-engine-api';
import type { GameConfigLogicAdapter, GamesDbAdapter } from '@ig/games-engine-be-models';
import type {
  GameInfoT
} from '@ig/games-engine-models';
import { MIN_TO_MS } from '@ig/utils';

export const loadGameConfigPreset1 = async (gamesDbAdapter: GamesDbAdapter): Promise<void> => {
  const gameConfigLogicAdapter: GameConfigLogicAdapter =
    new GameConfigLogic(gamesDbAdapter.getGameConfigsTableAdapter());
  const gameInfos: GameInfoT[] = [
    secretIslandGameConfig,
    escapeRoomGameConfig,
    wordleEnGameConfig,
    wordleFrGameConfig,
    wordleEsGameConfig,
  ];

  for (const gameInfo of gameInfos) {
    await gameConfigLogicAdapter.createGameConfig(gameInfo.gameConfigId, gameInfo);
  }
}

const secretIslandGameConfig: GameInfoT = {
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
  levelExposedConfigs: [],
}

const escapeRoomGameConfig: GameInfoT = {
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
  levelExposedConfigs: [],
}

const wordleEnGameConfig: GameInfoT = {
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
  levelExposedConfigs: [],
}

const wordleEsGameConfig: GameInfoT = {
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
  levelExposedConfigs: [],
}

const wordleFrGameConfig: GameInfoT = {
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
  levelExposedConfigs: [],
}

