
import type {
  GameConfigIdT,
  GameConfigNoIdT,
  MinimalPublicGameConfigT, PublicGameConfigT
} from '../../types/game/GameTypes';

// get minimal public game configs query

export type GetMinimalPublicGameConfigsResultT = {
  minimalPublicGameConfigs: MinimalPublicGameConfigT[],
}

export type GetMinimalPublicGameConfigsResponseT = {
  data: GetMinimalPublicGameConfigsResultT,
}

export const getMinimalPublicGameConfigsQuery = `
  query GetMinimalPublicGameConfigs {
    minimalPublicGameConfigs: getGameConfigs {
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

// get public game configs query

export type GetGameConfigsResultT = {
  publicGameConfigs: PublicGameConfigT[],
}

export type GetGameConfigsResponseT = {
  data: GetGameConfigsResultT,
}

export const getPublicGameConfigsQuery = `
  query GetPublicGameConfigs {
    publicGameConfigs: getGameConfigs {
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
      extraTimeMinutes
      extraTimeLimitDurationInfo {
        kind
        durationMs
      }
      publicLevelConfigs {
        levelName
      }
    }
  }
`;

// game config update

export type UpdateGameConfigInputT = {
  gameConfigId: GameConfigIdT,
  partialGameConfigNoId: Partial<GameConfigNoIdT>,
}

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
