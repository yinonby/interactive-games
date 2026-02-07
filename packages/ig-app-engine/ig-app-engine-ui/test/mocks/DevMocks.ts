
import type {
  GameInfoT, GameInstanceChatMessageT,
  GameInstanceExposedInfoT, MinimalGameInfoT
} from '@ig/games-engine-models';
import { MIN_TO_MS } from '@ig/utils';

const secretIslandMinimalConfig: GameInfoT = {
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

const escapeRoomMinimalConfig: GameInfoT = {
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

const wordleEnMinimalConfig: GameInfoT = {
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
  levelExposedConfigs: [{
    kind: 'wordle',
    wordleExposedConfig: {
      wordLength: 5,
      allowedGuessesNum: 6,
      langCode: 'en',
    }
  }],
}

const wordleEsMinimalConfig: GameInfoT = {
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

const wordleFrMinimalConfig: GameInfoT = {
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

export const devAvailableMinimalGameConfigs: MinimalGameInfoT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devAllGameConfigs: GameInfoT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devJoinedGameConfigs: GameInfoT[] = [];

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

