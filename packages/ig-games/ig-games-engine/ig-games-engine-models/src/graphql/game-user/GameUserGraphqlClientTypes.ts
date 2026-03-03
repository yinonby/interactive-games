
import type { GameConfigIdT, GameUserIdT, PublicGameUserT } from '../../types/game/GameTypes';

// get minimal public game instances query

export type GetPublicGameUserResultT = {
  publicGameUser: PublicGameUserT,
}

export type GetPublicGameUserResponseT = {
  data: GetPublicGameUserResultT,
}

export const getPublicGameUserQuery = `
  query GetPublicGameUser {
    publicGameUser: getPublicGameUser {
      gameUserId
      joinedGameConfigIds
    }
  }
`;

// add player

export type AddGameConfigIdInputT = {
  gameConfigId: GameConfigIdT,
}

export type AddGameConfigIdResultT = {
  gameUserId: GameUserIdT, // required to invalidate rtk query tag 'GameUserTag'
}

export type AddGameConfigIdResponseT = {
  data: {
    addGameConfigIdResult: AddGameConfigIdResultT,
  }
}

export const addGameConfigIdInputMutation = `
  mutation AddGameConfigId($input: AddGameConfigIdInput!) {
    addGameConfigIdResult: addGameConfigId(input: $input) {
      gameUserId
    }
  }
`;
