
import type {
  GameInstanceIdT,
  PublicGameInstanceT,
  PublicPlayerInfoT
} from '../../types/game/GameInstanceTypes';

// get minimal public game instances query

export type GetGameConfigInstanceIdsResultT = {
  gameInstanceIds: GameInstanceIdT[],
}

export type GetGameConfigInstanceIdsResponseT = {
  data: GetGameConfigInstanceIdsResultT,
}

export const getGameConfigInstanceIdsQuery = `
  query GetGameConfigInstanceIds($gameConfigId: ID!) {
    gameInstanceIds: getGameConfigInstanceIds(gameConfigId: $gameConfigId)
  }
`;

// get public game instances query

export type GetGameInstanceResultT = {
  publicGameInstance: PublicGameInstanceT | null,
}

export type GetGameInstanceResponseT = {
  data: GetGameInstanceResultT,
}

export const getGameInstanceQuery = `
  query GetPublicGameInstance($gameInstanceId: ID!) {
    publicGameInstance: getPublicGameInstance(gameInstanceId: $gameInstanceId) {
      gameInstanceId
    }
  }
`;

// add player

export type AddPlayerInputT = {
  gameInstanceId: GameInstanceIdT,
  publicPlayerInfo: PublicPlayerInfoT,
}

export type AddPlayerResultT = {
  status: 'ok';
}

export type AddPlayerResponseT = {
  data: {
    AddPlayerResult: AddPlayerResultT,
  }
}

export const addPlayerInputMutation = `
  mutation AddPlayer($input: AddPlayerInput!) {
    addPlayerResult: addPlayer(input: $input) {
      status
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
    StartPlayingResult: StartPlayingResultT,
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
    SubmitGuessResult: SubmitGuessResultT,
  }
}

export const submitGuessInputMutation = `
  mutation SubmitGuess($input: SubmitGuessInput!) {
    submitGuessResult: submitGuess(input: $input) {
      isGuessCorrect
    }
  }
`;
