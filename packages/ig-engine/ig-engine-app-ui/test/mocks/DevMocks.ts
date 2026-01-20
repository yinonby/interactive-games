
import type { GameInstanceChatMessageT, GameInstanceExposedInfoT, MinimalGameConfigT } from "@ig/engine-models";

const secretIslandMinimalConfig: MinimalGameConfigT = {
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
}

const escapeRoomMinimalConfig: MinimalGameConfigT = {
  gameConfigId: "escape-room-harry-potter",
  kind: "joint-game",
  gameName: "Escape Room - Harry Potter",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "escape-room-1",
}

const wordleEnMinimalConfig: MinimalGameConfigT = {
  gameConfigId: "wordle-english",
  kind: "joint-game",
  gameName: "Wordle - English",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "wordle-1",
}

const wordleEsMinimalConfig: MinimalGameConfigT = {
  gameConfigId: "wordle-spanish",
  kind: "joint-game",
  gameName: "Wordle - Spanish",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "wordle-2",
}

const wordleFrMinimalConfig: MinimalGameConfigT = {
  gameConfigId: "wordle-french",
  kind: "joint-game",
  gameName: "Wordle - French",
  maxDurationMinutes: 60,
  gamePrice: "free",
  maxParticipants: 6,
  imageAssetName: "wordle-3",
}

export const devAvailableMinimalGameConfigs: MinimalGameConfigT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devAllGameInstanceExposedInfos: GameInstanceExposedInfoT[] = []

export const _devAllGameInstanceExposedInfos: GameInstanceExposedInfoT[] = [{
  gameInstanceId: "giid-1",
  invitationCode: "invt-code-giid-1",
  gameConfig: {
    ...secretIslandMinimalConfig,
    extraTimeMinutes: 10,
    extraTimeLimitMinutes: 20,
    levelConfigs: [],
  },
  gameStatus: "in-process",
  playerExposedInfos: [{
    playerUserId: "user-2",
    playerNickname: "player 2",
    playerRole: "player",
    playerStatus: "playing",
  }, {
    playerUserId: "user-3",
    playerNickname: "player 3",
    playerRole: "player",
    playerStatus: "suspended",
  }, {
    playerUserId: "user-4",
    playerNickname: "player 4",
    playerRole: "player",
    playerStatus: "invited",
  }],
}, {
  gameInstanceId: "giid-2",
  invitationCode: "invt-code-giid-2",
  gameConfig: {
    ...escapeRoomMinimalConfig,
    extraTimeMinutes: 10,
    extraTimeLimitMinutes: 20,
    levelConfigs: [],
  },
  gameStatus: "in-process",
  playerExposedInfos: [{
    playerUserId: "user-5",
    playerNickname: "player 5",
    playerRole: "player",
    playerStatus: "playing",
  }, {
    playerUserId: "user-6",
    playerNickname: "player 6",
    playerRole: "admin",
    playerStatus: "suspended",
  }, {
    playerUserId: "user-7",
    playerNickname: "player 7",
    playerRole: "player",
    playerStatus: "invited",
  }],
}, {
  gameInstanceId: "giid-3",
  invitationCode: "invt-code-giid-3",
  gameConfig: {
    ...wordleEnMinimalConfig,
    extraTimeMinutes: 10,
    extraTimeLimitMinutes: 20,
    levelConfigs: [],
  },
  gameStatus: "not-started",
  playerExposedInfos: [{
    playerUserId: "user-2",
    playerNickname: "player 2",
    playerRole: "admin",
    playerStatus: "playing",
  }],
}, {
  gameInstanceId: "giid-wordle-french",
  invitationCode: "invt-code-giid-wordle-french",
  gameConfig: {
    ...wordleFrMinimalConfig,
    extraTimeMinutes: 10,
    extraTimeLimitMinutes: 20,
    levelConfigs: [],
  },
  gameStatus: "in-process",
  playerExposedInfos: [{
    playerUserId: "user-2",
    playerNickname: "player 2",
    playerRole: "admin",
    playerStatus: "playing",
  }, {
    playerUserId: "user-3",
    playerNickname: "player 3",
    playerRole: "player",
    playerStatus: "suspended",
  }, {
    playerUserId: "user-4",
    playerNickname: "player 4",
    playerRole: "player",
    playerStatus: "invited",
  }],
}];

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

