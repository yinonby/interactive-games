
import type {
  GameInstanceIdT,
  PublicGameInstanceT
} from '../../types/game/GameInstanceTypes';
import type { GameConfigIdT } from '../../types/game/GameTypes';
import { imageInfoQuerySelectors, publicGameConfigQuerySelectors } from '../game-config/GameConfigGraphqlClientTypes';

const publicCodePuzzleConfigQuerySelector = `
  kind
  codeLength
  accessories {
    kind
    imageInfo {
      ${imageInfoQuerySelectors}
    }
  }
  usedAccessories {
    kind
    imageInfo {
      ${imageInfoQuerySelectors}
    }
  }
  instructions {
    kind
    text
  }
`;

const pluginStateQuerySelector = `
  kind

  publicCodePuzzleConfig {
    ${publicCodePuzzleConfigQuerySelector}
  }
  codeSolution
  isCaseSensitive

  publicWordleConfig {
    langCode
    wordLength
    difficulty
    allowedGuessesNum
  }
  publicWordleState {
    guessDatas {
      guess
      letterAnalyses
    }
    correctGuess
  }
  wordleSolution
`;

const gameStateQuerySelectors = `
  gameStatus
  startTimeTs
  lastGivenExtraTimeTs
  finishTimeTs
  levelStates {
    levelStatus
    startTimeTs
    solvedTimeTs
    pluginState {
      ${pluginStateQuerySelector}
    }
  }
`

const publicPlayerInfoQuerySelectors = `
  playerId
  playerNickname
  playerRole
  playerStatus
`;

// get minimal public game instances query

export type GetGameInstanceIdsForGameConfigResultT = {
  gameInstanceIds: GameInstanceIdT[],
}

export type GetGameInstanceIdsForGameConfigResponseT = {
  data: GetGameInstanceIdsForGameConfigResultT,
}

export const getGameInstanceIdsForGameConfigQuery = `
  query GetGameInstanceIdsForGameConfig($gameConfigId: ID!) {
    gameInstanceIds: getGameInstanceIdsForGameConfig(gameConfigId: $gameConfigId)
  }
`;

// get public game instances query

export type GetGameInstanceResultT = {
  publicGameInstance: PublicGameInstanceT,
}

export type GetGameInstanceResponseT = {
  data: GetGameInstanceResultT,
}

export const getGameInstanceQuery = `
  query GetPublicGameInstance($gameInstanceId: ID!) {
    publicGameInstance: getPublicGameInstance(gameInstanceId: $gameInstanceId) {
      gameInstanceId
      invitationCode
      publicGameConfig {
        ${publicGameConfigQuerySelectors}
      }
      gameState {
        ${gameStateQuerySelectors}
      }
      publicPlayerInfos {
        ${publicPlayerInfoQuerySelectors}
      }
    }
  }
`;

// create game instance

export type CreateGameInstanceInputT = {
  gameConfigId: GameConfigIdT,
}

export type CreateGameInstanceResultT = {
  gameInstanceId: GameInstanceIdT;
}

export type CreateGameInstanceResponseT = {
  data: {
    createGameInstanceResult: CreateGameInstanceResultT,
  }
}

export const createGameInstanceInputMutation = `
  mutation CreateGameInstance($input: CreateGameInstanceInput!) {
    createGameInstanceResult: createGameInstance(input: $input) {
      gameInstanceId
    }
  }
`;

// add player

export type JoinGameByInviteInputT = {
  invitationCode: string,
}

export type JoinGameByInviteResultT = {
  gameInstanceId: GameInstanceIdT,
}

export type JoinGameByInviteResponseT = {
  data: {
    joinGameByInviteResult: JoinGameByInviteResultT,
  }
}

export const joinGameByInviteInputMutation = `
  mutation JoinGameByInvite($input: JoinGameByInviteInput!) {
    joinGameByInviteResult: joinGameByInvite(input: $input) {
      gameInstanceId
    }
  }
`;

// start playing

export type StartPlayingInputT = {
  gameInstanceId: GameInstanceIdT,
}

export type StartPlayingResultT = {
  status: 'ok';
}

export type StartPlayingResponseT = {
  data: {
    startPlayingResult: StartPlayingResultT,
  }
}

export const startPlayingInputMutation = `
  mutation StartPlaying($input: StartPlayingInput!) {
    startPlayingResult: startPlaying(input: $input) {
      status
    }
  }
`;

// submit guess

export type SubmitGuessInputT = {
  gameInstanceId: GameInstanceIdT,
  levelIdx: number,
  guess: string,
}

export type SubmitGuessResultT = {
  isGuessCorrect: boolean,
}

export type SubmitGuessResponseT = {
  data: {
    submitGuessResult: SubmitGuessResultT,
  }
}

export const submitGuessInputMutation = `
  mutation SubmitGuess($input: SubmitGuessInput!) {
    submitGuessResult: submitGuess(input: $input) {
      isGuessCorrect
    }
  }
`;
