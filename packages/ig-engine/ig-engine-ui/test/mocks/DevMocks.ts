
import type { GameConfigT, GameInstanceChatMessageT, GameInstanceExposedInfoT, MinimalGameConfigT } from '@ig/games-models';
import { MIN_TO_MS } from '@ig/lib';

const secretIslandMinimalConfig: GameConfigT = {
  gameConfigId: 'treasure-hunt-secret-island', // this game is already joined in this dev preset
  kind: 'joint-game',
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

const escapeRoomMinimalConfig: GameConfigT = {
  gameConfigId: 'escape-room-harry-potter',
  kind: 'joint-game',
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

const wordleEnMinimalConfig: GameConfigT = {
  gameConfigId: 'wordle-english',
  kind: 'joint-game',
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

const wordleEsMinimalConfig: GameConfigT = {
  gameConfigId: 'wordle-spanish',
  kind: 'joint-game',
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

const wordleFrMinimalConfig: GameConfigT = {
  gameConfigId: 'wordle-french',
  kind: 'joint-game',
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

export const devAvailableMinimalGameConfigs: MinimalGameConfigT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devAllGameConfigs: GameConfigT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devJoinedGameConfigs: GameConfigT[] = [];

export const devAllGameInstanceExposedInfos: GameInstanceExposedInfoT[] = []

export const devChatMessages: GameInstanceChatMessageT[] = [{
  gameInstanceId: 'giid-1',
  chatMsgId: 'msg-1',
  sentTs: 2,
  playerUserId: 'user-2',
  msgText: 'Hey',
}, {
  gameInstanceId: 'giid-1',
  chatMsgId: 'msg-1',
  sentTs: 3,
  playerUserId: 'user-3',
  msgText: 'Let\'s play',
}]

