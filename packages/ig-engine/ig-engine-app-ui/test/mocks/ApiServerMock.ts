
import type { HttpAdapter, HttpMethod } from "@ig/client-utils";
import {
  type GameConfigIdT, type GameInstanceChatMessageT,
  type GameInstanceExposedInfoT, type GameInstanceIdT,
  type GamesUserConfigT,
  type GetAppConfigResponseT,
  type GetGameInstanceChatResponseT,
  type GetGameInstanceResponseT,
  type GetGamesConfigResponseT,
  type GetGamesUserConfigResponseT, type MinimalGameConfigT,
  type PostGameInstanceChatMessageParamT,
  type PostGameInstanceChatMessageResponseT
} from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import { getLocalUserId } from '../../src/app/layout/AppConfigUtils';
import { useClientLogger } from "../../src/app/providers/useClientLogger";
import {
  devAllGameInstanceExposedInfos,
  devAvailableMinimalGameConfigs, devChatMessages,
} from "./DevMocks";

const handlePlayGame = async (gameConfigId: GameConfigIdT): Promise<string> => {
  const minimalGameConfig: MinimalGameConfigT | undefined =
    devAvailableMinimalGameConfigs.find(e => e.gameConfigId === gameConfigId);
  const gameInstanceId = "giid-" + gameConfigId;
  const curUserId = await getLocalUserId();

  if (minimalGameConfig === undefined) {
    throw { status: 500, apiErrCode: "apiError:server" };
  }
  if (curUserId === null) {
    throw { status: 500, apiErrCode: "apiError:server" };
  }

  const gameInstanceExposedInfo = devAllGameInstanceExposedInfos.find(e => e.gameInstanceId === gameInstanceId);
  if (gameInstanceExposedInfo !== undefined) {
    throw { status: 500, apiErrCode: "apiError:server" };
  }

  devAllGameInstanceExposedInfos.push({
    gameInstanceId: gameInstanceId,
    invitationCode: "invt-code-" + gameInstanceId,
    gameConfig: {
      ...minimalGameConfig,
      extraTimeMinutes: 10,
      extraTimeLimitMinutes: 20,
      levelConfigs: [],
    },
    gameStatus: "in-process",
    playerExposedInfos: [{
      playerUserId: curUserId,
      playerNickname: "my nickname",
      playerRole: "admin",
      playerStatus: "playing",
    }],
  })
  return gameInstanceId;
}

const handleAcceptInvite = async (invitationCode: string): Promise<string> => {
  const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined =
    devAllGameInstanceExposedInfos.find(e => e.invitationCode === invitationCode);

  if (gameInstanceExposedInfo === undefined) {
    throw { status: 500, apiErrCode: "gamesApiError:invalidInvitationCode" };
  }

  const curUserId = await getLocalUserId();
  if (curUserId === null) {
    throw { status: 500, apiErrCode: "apiError:server" };
  }

  if (gameInstanceExposedInfo.playerExposedInfos.find(e => e.playerUserId === curUserId)) {
    throw { status: 500, apiErrCode: "gamesApiError:gameInstanceAlreadyJoined" };
  }

  gameInstanceExposedInfo.playerExposedInfos.push({
    playerUserId: curUserId,
    playerNickname: "my nickname",
    playerRole: "player",
    playerStatus: "playing",
  });

  return gameInstanceExposedInfo.gameInstanceId;
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
    this.logger.debug("Mock API Dev Server: request url", this.apiUrl + options.url);

    if (options.url === "/app-config") {
      const response: GetAppConfigResponseT = {
        version: "1.0.0",
      }
      return response as TResponse;
    } else if (options.url === "/games/games-config") {
      const availableMinimalGameConfigs = devAvailableMinimalGameConfigs.filter(e =>
        !devAllGameInstanceExposedInfos.find(e2 => e2.gameConfig.gameConfigId ===  e.gameConfigId));
      const response: GetGamesConfigResponseT = {
        gamesConfig: {
          availableMinimalGameConfigs: availableMinimalGameConfigs,
        }
      }
      return response as TResponse;
    } else if (options.url === "/games/user-config") {
      const curUserId = await getLocalUserId();
      const gamesUserConfig: GamesUserConfigT = {
        minimalGameInstanceExposedInfos: devAllGameInstanceExposedInfos
          .filter(e => e.playerExposedInfos.find(e2 => e2.playerUserId === curUserId))
          .map(e => ({
            ...e,
            minimalGameConfig: e.gameConfig,
          })),
      }
      const response: GetGamesUserConfigResponseT = {
        gamesUserConfig: gamesUserConfig,
      }
      return response as TResponse;
    } else if (options.url === "/games/user-config/play-game") {
      const data: { gameConfigId: GameConfigIdT } = options.data as unknown as { gameConfigId: GameConfigIdT };
      const gameInstanceId: GameInstanceIdT = await handlePlayGame(data.gameConfigId);
      return { gameInstanceId: gameInstanceId } as TResponse;
    } else if (options.url === "/games/user-config/accept-invite") {
      const data: { invitationCode: string } = options.data as unknown as { invitationCode: string };
      const gameInstanceId: GameInstanceIdT = await handleAcceptInvite(data.invitationCode);
      return { gameInstanceId: gameInstanceId } as TResponse;
    } else if (options.url.startsWith("/games/game-instance/") && options.url.endsWith("chat/message")) {
      const gameInstanceId: GameInstanceIdT = options.url.split("/")[3] as GameInstanceIdT;
      const data: PostGameInstanceChatMessageParamT = options.data as unknown as PostGameInstanceChatMessageParamT;

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
    } else if (options.url.startsWith("/games/game-instance/") && options.url.endsWith("chat")) {
      const gameInstanceId: GameInstanceIdT = options.url.split("/")[3] as GameInstanceIdT;

      const response: GetGameInstanceChatResponseT = {
        chatMessages: getGameInstanceChatMessages(gameInstanceId),
      }
      return response as TResponse;
    } else if (options.url.startsWith("/games/game-instance/")) {
      const gameInstanceId: GameInstanceIdT = options.url.split("/")[3] as GameInstanceIdT;
      const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined = devAllGameInstanceExposedInfos.find(e =>
        e.gameInstanceId === gameInstanceId
      );
      if (gameInstanceExposedInfo === undefined) {
        throw new Error("Game instance not found");
      }
      const response: GetGameInstanceResponseT = {
        gameInstanceExposedInfo: gameInstanceExposedInfo,
      }
      return response as TResponse;
    } else {
      return {} as TResponse;
    }
  }
}
