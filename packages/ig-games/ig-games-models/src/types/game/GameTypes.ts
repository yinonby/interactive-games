
import type { AppImageAssetT, UserIdT } from '@ig/engine-models';
import type { XOR } from '@ig/lib';
import type { GameStateT } from './GameStateTypes';
import type { LevelConfigT } from './LevelTypes';

export type GameConfigIdT = string;

export type CurrencyT = 'EUR' | 'USD';
export const currencyToSymbol: Record<CurrencyT, string> = {
  'USD': '$',
  'EUR': '€',
}

export type PriceT = {
  priceRate: number,
  priceCurrency: CurrencyT,
}

export type MinimalGameConfigT = {
  gameConfigId: GameConfigIdT,
  kind: 'joint-game',
  gameName: string,
  maxDurationMinutes: number | 'unlimited',
  gamePrice: PriceT | 'free',
  maxParticipants: number,
} & XOR<
  { imageAssetName: AppImageAssetT },
  { imageUrl: string }
>

export type GameConfigT = MinimalGameConfigT & {
  extraTimeMinutes: number,
  extraTimeLimitMinutes: number | 'unlimited',
  levelConfigs: LevelConfigT[],
}

export type GameInstanceIdT = string;

// config + state = info
export type MinimalGameInstanceExposedInfoT = {
  gameInstanceId: GameInstanceIdT,
  invitationCode: string,
  minimalGameConfig: MinimalGameConfigT,
  gameState: GameStateT,
  playerExposedInfos: [PlayerExposedInfoT, ...PlayerExposedInfoT[]], // at least one player
}

export type GameInstanceExposedInfoT = Omit<MinimalGameInstanceExposedInfoT, 'minimalGameConfig'> & {
  gameConfig: GameConfigT,
}

export type PlayerRoleT = 'admin' | 'player';
export type PlayerStatusT = 'invited' | 'active' | 'suspended';

export type PlayerExposedInfoT = {
  playerUserId: UserIdT,
  playerNickname: string,
  playerRole: PlayerRoleT,
  playerStatus: PlayerStatusT,
}

export type ChatMsgIdT = string;

export type GameInstanceChatMessageT = {
  gameInstanceId: GameInstanceIdT,
  chatMsgId: ChatMsgIdT,
  sentTs: number,
  playerUserId: UserIdT,
  msgText: string,
}
