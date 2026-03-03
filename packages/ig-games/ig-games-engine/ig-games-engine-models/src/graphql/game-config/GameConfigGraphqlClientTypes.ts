
import type {
  GameConfigIdT,
  GameConfigNoIdT,
  MinimalPublicGameConfigT, PublicGameConfigT
} from '../../types/game/GameTypes';

export const imageInfoQuerySelectors = `
  kind
  imageAssetName
  imageUrl
`;

export const minimalPublicGameConfigQuerySelectors = `
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
    ${imageInfoQuerySelectors}
  }
`;

export const publicGameConfigQuerySelectors = `
  ${minimalPublicGameConfigQuerySelectors}
  extraTimeMinutes
  extraTimeLimitDurationInfo {
    kind
    durationMs
  }
  publicLevelConfigs {
    levelName
  }
`;

// get minimal public game configs query

export type GetMinimalPublicGameConfigsResultT = {
  minimalPublicGameConfigs: MinimalPublicGameConfigT[],
}

export type GetMinimalPublicGameConfigsResponseT = {
  data: GetMinimalPublicGameConfigsResultT,
}

export const getMinimalPublicGameConfigsQuery = `
  query GetMinimalPublicGameConfigs {
    minimalPublicGameConfigs: getMinimalPublicGameConfigs {
      ${minimalPublicGameConfigQuerySelectors}
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

// gameConfigIds is optional, in its absence all public game configs are retrieved
export const getPublicGameConfigsQuery = `
  query GetPublicGameConfigs($gameConfigIds: [ID!]) {
    publicGameConfigs: getPublicGameConfigs(gameConfigIds: $gameConfigIds) {
      ${publicGameConfigQuerySelectors}
    }
  }
`;

// get public game configs query

export type GetPublicGameConfigResultT = {
  publicGameConfig: PublicGameConfigT,
}

export type GetPublicGameConfigResponseT = {
  data: GetPublicGameConfigResultT,
}

export const getPublicGameConfigQuery = `
  query GetPublicGameConfig($gameConfigId: ID!) {
    publicGameConfig: getPublicGameConfig(gameConfigId: $gameConfigId) {
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
