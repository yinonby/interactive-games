
import type { GameConfigT, GameInfoNoIdT, GameInfoT } from '../../types/game/GameTypes';

// query

export type GetGameConfigsResultT = {
  gameConfigs: GameConfigT[],
}

export type GetGameConfigsResponseT = {
  data: GetGameConfigsResultT,
}

export const getGameConfigsQuery = `
  query GetGameConfigs {
    gameConfigs: getGameConfigs {
      gameConfigId
      gameInfoNoId {
        kind
        gameName
        maxParticipants
        maxDurationInfo {
          kind
          durationMs
        }
        gamePriceInfo {
          kind
          priceRate
          priceCurrency
        }
        maxParticipants
        imageInfo {
          kind
          imageAssetName
          imageUrl
        }
      }
    }
  }
`;

// mutation

export type UpdateGameConfigInputT =
  Pick<GameInfoT, 'gameConfigId'> &
  Partial<GameInfoNoIdT>;

export type UpdateGameConfigResultT = {
  status: 'ok';
};

export type UpdateGameConfigResponseT = {
  data: {
    updateGameConfigResult: UpdateGameConfigResultT,
  }
};

export const updateGameConfigMutation = `
  mutation UpdateGameConfig($input: UpdateGameConfigInput!) {
    updateGameConfigResult: updateGameConfig(input: $input) {
      status
    }
  }
`;
