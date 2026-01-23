
import type { GameConfigT, GameInstanceChatMessageT, GameInstanceExposedInfoT, MinimalGameConfigT } from "@ig/engine-models";

const secretIslandMinimalConfig: GameConfigT = {
  gameConfigId: "treasure-hunt-secret-island", // this game is already joined in this dev preset
  kind: "joint-game",
  gameName: "Treasure Hunt - Secret Island",
  maxDurationMinutes: 60,
  gamePrice: {
    priceRate: 5,
    priceCurrency: "EUR",
  },
  maxParticipants: 6,
  imageAssetName: "treasure-hunt-1",

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitMinutes: 20,
  levelConfigs: [],
}

const escapeRoomMinimalConfig: GameConfigT = {
  gameConfigId: "escape-room-harry-potter",
  kind: "joint-game",
  gameName: "Escape Room - Harry Potter",
  maxDurationMinutes: 'unlimited',
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "escape-room-1",

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitMinutes: 'unlimited',
  levelConfigs: [],
}

const wordleEnMinimalConfig: GameConfigT = {
  gameConfigId: "wordle-english",
  kind: "joint-game",
  gameName: "Wordle - English",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "wordle-1",

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitMinutes: 20,
  levelConfigs: [],
}

const wordleEsMinimalConfig: GameConfigT = {
  gameConfigId: "wordle-spanish",
  kind: "joint-game",
  gameName: "Wordle - Spanish",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "wordle-2",

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitMinutes: 20,
  levelConfigs: [],
}

const wordleFrMinimalConfig: GameConfigT = {
  gameConfigId: "wordle-french",
  kind: "joint-game",
  gameName: "Wordle - French",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "wordle-3",

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitMinutes: 20,
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
  gameInstanceId: "giid-1",
  chatMsgId: "msg-1",
  sentTs: 2,
  playerUserId: "user-2",
  msgText: "Hey",
}, {
  gameInstanceId: "giid-1",
  chatMsgId: "msg-1",
  sentTs: 3,
  playerUserId: "user-3",
  msgText: "Let's play",
}]

