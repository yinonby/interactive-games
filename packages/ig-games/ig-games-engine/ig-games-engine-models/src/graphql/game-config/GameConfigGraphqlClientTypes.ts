
// query

import type { GameConfigT, MinimalGameConfigT } from '../../types/game/GameTypes';

export type GetMinimalGameConfigsResultT = {
  minimalGameConfigs: MinimalGameConfigT[],
}

export type GetMinimalGameConfigsResponseT = {
  data: GetMinimalGameConfigsResultT,
}

export const getMinimalGameConfigsQuery = `
  query GetMinimalGameConfigs {
    minimalGameConfigs: getGameConfigs {
      gameConfigId
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
`;

// mutation

export type UpdateGameConfigInputT =
  Pick<GameConfigT, 'gameConfigId'> &
  Partial<Omit<GameConfigT, 'gameConfigId'>>;

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
