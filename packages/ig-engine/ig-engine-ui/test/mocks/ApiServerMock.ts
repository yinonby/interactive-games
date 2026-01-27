
import type { HttpAdapter, HttpMethod } from '@ig/client-utils';
import type { GetAppConfigResponseT } from '@ig/engine-models';
import {
  type GameConfigIdT, type GameConfigT, type GameInstanceChatMessageT,
  type GameInstanceExposedInfoT, type GameInstanceIdT,
  type GamesUserConfigT,
  type GetGameInstanceChatResponseT,
  type GetGameInstanceResponseT,
  type GetGamesConfigResponseT,
  type GetGamesUserConfigResponseT,
  type PostGameInstanceChatMessageParamsT,
  type PostGameInstanceChatMessageResponseT,
  type PostGameInstanceStartResponseT
} from '@ig/games-models';
import { generateUuidv4, type LoggerAdapter } from '@ig/lib';
import { getLocalUserId } from '../../src/app/layout/AppConfigUtils';
import { useClientLogger } from '../../src/app/providers/useClientLogger';
import {
  devAllGameConfigs,
  devAllGameInstanceExposedInfos,
  devAvailableMinimalGameConfigs, devChatMessages,
  devJoinedGameConfigs,
} from './DevMocks';

const handlePlayGame = async (gameConfigId: GameConfigIdT): Promise<void> => {
  const gameConfig: GameConfigT | undefined =
    devAllGameConfigs.find(e => e.gameConfigId === gameConfigId);
  const curUserId = await getLocalUserId();

  if (gameConfig === undefined) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }
  if (curUserId === null) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  const joinedGameConfig: GameConfigT | undefined =
    devJoinedGameConfigs.find(e => e.gameConfigId === gameConfigId);

  if (joinedGameConfig !== undefined) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  devJoinedGameConfigs.push(gameConfig);
}

const handleAcceptInvite = async (invitationCode: string): Promise<string> => {
  const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined =
    devAllGameInstanceExposedInfos.find(e => e.invitationCode === invitationCode);

  if (gameInstanceExposedInfo === undefined) {
    throw { status: 500, apiErrCode: 'gamesApiError:invalidInvitationCode' };
  }

  const curUserId = await getLocalUserId();
  if (curUserId === null) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  if (gameInstanceExposedInfo.playerExposedInfos.find(e => e.playerUserId === curUserId)) {
    throw { status: 500, apiErrCode: 'gamesApiError:gameInstanceAlreadyJoined' };
  }

  gameInstanceExposedInfo.playerExposedInfos.push({
    playerUserId: curUserId,
    playerNickname: 'my nickname',
    playerRole: 'player',
    playerStatus: 'active',
  });

  return gameInstanceExposedInfo.gameInstanceId;
}

const handleCreateGameInstance = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT> => {
  const gameInstanceId = 'giid-' + gameConfigId + '-' + generateUuidv4().slice(0, 8);
  const curUserId = await getLocalUserId();

  if (curUserId === null) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  const joinedGameConfig: GameConfigT | undefined =
    devJoinedGameConfigs.find(e => e.gameConfigId === gameConfigId);

  if (joinedGameConfig === undefined) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  devAllGameInstanceExposedInfos.push({
    gameInstanceId: gameInstanceId,
    invitationCode: 'invt-code-' + gameInstanceId,
    gameConfig: joinedGameConfig,
    gameState: {
      gameStatus: 'not-started',
      levelStates: [],
    },
    playerExposedInfos: [{
      playerUserId: curUserId,
      playerNickname: 'my nickname',
      playerRole: 'admin',
      playerStatus: 'active',
    }],
  });

  return gameInstanceId;
}

const getGameInstanceIds = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]> => {
  return devAllGameInstanceExposedInfos.filter(e => e.gameConfig.gameConfigId === gameConfigId)
    .map(e => e.gameInstanceId);
}

const handleStartGame = (gameInstanceId: GameInstanceIdT): void => {
  const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined = devAllGameInstanceExposedInfos.find(e =>
    e.gameInstanceId === gameInstanceId
  );
  if (gameInstanceExposedInfo === undefined) {
    throw new Error('Game instance not found');
  }
  if (gameInstanceExposedInfo.gameState.gameStatus !== 'not-started') {
    throw new Error('Game already started');
  }

  gameInstanceExposedInfo.gameState = {
    ...gameInstanceExposedInfo.gameState,
    gameStatus: 'in-process',
    startTimeTs: Date.now(),
  };
}

const getGameInstanceChatMessages = (gameInstanceId: GameInstanceIdT): GameInstanceChatMessageT[] => {
  return devChatMessages.filter(e => e.gameInstanceId === gameInstanceId).sort((e1, e2) => e1.sentTs - e2.sentTs);
}

export class ApiServerMock implements HttpAdapter {
  constructor(
    private apiUrl: string,
    private logger: LoggerAdapter = useClientLogger(),
  ) { }

  async request<TResponse, TData = unknown>(options: {
    url: string;
    method: HttpMethod;
    data?: TData;
  }): Promise<TResponse> {
    this.logger.debug('Mock API Dev Server: request url', this.apiUrl + options.url);

    if (options.url === '/app-config') {
      const response: GetAppConfigResponseT = {
        version: '1.0.0',
      }
      return response as TResponse;
    } else if (options.url === '/games/games-config') {
      const availableMinimalGameConfigs = devAvailableMinimalGameConfigs.filter(e =>
        !devAllGameInstanceExposedInfos.find(e2 => e2.gameConfig.gameConfigId ===  e.gameConfigId));
      const response: GetGamesConfigResponseT = {
        gamesConfig: {
          availableMinimalGameConfigs: [...availableMinimalGameConfigs], // clone this array so it is not frozen
        }
      }
      return response as TResponse;
    } else if (options.url === '/games/user-config') {
      const gamesUserConfig: GamesUserConfigT = {
        joinedGameConfigs: [...devJoinedGameConfigs], // clone this array so it is not frozen
      }
      const response: GetGamesUserConfigResponseT = {
        gamesUserConfig: gamesUserConfig,
      }
      return response as TResponse;
    } else if (options.url === '/games/user-config/play-game') {
      const data: { gameConfigId: GameConfigIdT } = options.data as unknown as { gameConfigId: GameConfigIdT };
      await handlePlayGame(data.gameConfigId);
      return { status: 'ok' } as TResponse;
    } else if (options.url === '/games/user-config/accept-invite') {
      const data: { invitationCode: string } = options.data as unknown as { invitationCode: string };
      const gameInstanceId: GameInstanceIdT = await handleAcceptInvite(data.invitationCode);
      return { gameInstanceId: gameInstanceId } as TResponse;
    } else if (options.url === '/games/user-config/create-game-instance') {
      const data: { gameConfigId: GameConfigIdT } = options.data as unknown as { gameConfigId: GameConfigIdT };
      const gameInstanceId: GameInstanceIdT = await handleCreateGameInstance(data.gameConfigId);
      return { gameInstanceId: gameInstanceId } as TResponse;
    } else if (options.url.startsWith('/games/game/') && options.url.endsWith('game-instance-ids')) {
      const gameConfigId: GameConfigIdT = options.url.split('/')[3] as GameConfigIdT;
      const gameInstanceIds: GameInstanceIdT[] = await getGameInstanceIds(gameConfigId);
      return { gameInstanceIds: gameInstanceIds } as TResponse;
    } else if (options.url.startsWith('/games/game-instance/') && options.url.endsWith('chat/message')) {
      const gameInstanceId: GameInstanceIdT = options.url.split('/')[3] as GameInstanceIdT;
      const data: PostGameInstanceChatMessageParamsT = options.data as unknown as PostGameInstanceChatMessageParamsT;

      const chatMessage: GameInstanceChatMessageT = {
        gameInstanceId: gameInstanceId,
        chatMsgId: Date.now().toString(),
        sentTs: Date.now(),
        playerUserId: data.playerUserId,
        msgText: data.chatMessage,
      }
      devChatMessages.push(chatMessage)

      const response: PostGameInstanceChatMessageResponseT = {
        chatMsgId: chatMessage.chatMsgId,
      }
      return response as TResponse;
    } else if (options.url.startsWith('/games/game-instance/') && options.url.endsWith('chat')) {
      const gameInstanceId: GameInstanceIdT = options.url.split('/')[3] as GameInstanceIdT;

      const response: GetGameInstanceChatResponseT = {
        chatMessages: getGameInstanceChatMessages(gameInstanceId),
      }
      return response as TResponse;
    } else if (options.url.startsWith('/games/game-instance/') && options.url.endsWith('start')) {
      const gameInstanceId: GameInstanceIdT = options.url.split('/')[3] as GameInstanceIdT;
      handleStartGame(gameInstanceId);

      const response: PostGameInstanceStartResponseT = {
        status: 'ok',
      }
      return response as TResponse;
    } else if (options.url.startsWith('/games/game-instance/')) {
      const gameInstanceId: GameInstanceIdT = options.url.split('/')[3] as GameInstanceIdT;
      const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined = devAllGameInstanceExposedInfos.find(e =>
        e.gameInstanceId === gameInstanceId
      );
      if (gameInstanceExposedInfo === undefined) {
        throw new Error('Game instance not found');
      }
      const response: GetGameInstanceResponseT = {
        gameInstanceExposedInfo: {...gameInstanceExposedInfo}, // clone this array so it is not frozen
      }
      return response as TResponse;
    } else {
      return {} as TResponse;
    }
  }
}
