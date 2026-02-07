
// query

import type { MinimalGameInfoT } from '../../types/game/GameTypes';

export type GetMinimalGameInfosResultT = {
  minimalGameInfos: MinimalGameInfoT[],
}

export type GetMinimalGameInfosResponseT = {
  data: GetMinimalGameInfosResultT,
}

export const getMinimalGameInfosQuery = `
  query GetMinimalGameInfos {
    minimalGameInfos: getGameInfos {
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
