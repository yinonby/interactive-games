
import type { HttpAdapter, HttpMethod } from "@ig/client-utils";
import type {
  GameConfigIdT, GameInstanceChatMessageT,
  GameInstanceExposedInfoT, GameInstanceIdT,
  GetAppConfigResponseT,
  GetGameInstanceChatResponseT,
  GetGameInstanceResponseT,
  GetGamesConfigResponseT,
  GetUserConfigResponseT, MinimalGameConfigT,
  PostGameInstanceChatMessageParamT,
  PostGameInstanceChatMessageResponseT,
  UserConfigT
} from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import { useClientLogger } from "../../src/app/providers/useClientLogger";
import {
  devAvailableMinimalGameConfigs, devChatMessages,
  devExternalGameInstanceExposedInfos, devGameInstanceExposedInfos
} from "./DevMocks";

const handlePlayGame = (gameConfigId: GameConfigIdT): GameInstanceIdT | null => {
  const minimalGameConfig: MinimalGameConfigT | undefined =
    devAvailableMinimalGameConfigs.find(e => e.gameConfigId === gameConfigId);
  if (minimalGameConfig === undefined) return null;
  const gameInstanceId = "giid-" + gameConfigId;

  devGameInstanceExposedInfos.push({
    gameInstanceId: gameInstanceId,
    invitationCode: "invt-code-" + gameInstanceId,
    gameConfig: {
      ...minimalGameConfig,
      extraTimeMinutes: 10,
      extraTimeLimitMinutes: 20,
      levelConfigs: [],
    },
    playerRole: "admin",
    playerStatus: "playing",
    gameStatus: "not-started",
    otherPlayerExposedInfos: [],
  });

  return gameInstanceId;
}

const handleAcceptInvite = (invitationCode: string): GameInstanceIdT | null => {
  const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined =
    devExternalGameInstanceExposedInfos.find(e => e.invitationCode === invitationCode);

  if (gameInstanceExposedInfo === undefined) return null;

  devGameInstanceExposedInfos.push(gameInstanceExposedInfo);

  return gameInstanceExposedInfo.gameInstanceId;
}

const getGameInstanceChatMessages = (gameInstanceId: GameInstanceIdT): GameInstanceChatMessageT[] => {
  return devChatMessages.filter(e => e.gameInstanceId === gameInstanceId).sort((e1, e2) => e1.sentTs - e2.sentTs);
}

export class ApiServerMock implements HttpAdapter {
  constructor(
    private apiUrl: string,
    private logger: LoggerAdapter = useClientLogger(),
  ) {}

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
      const response: GetGamesConfigResponseT = {
        availableMinimalGameConfigs: devAvailableMinimalGameConfigs,
      }
      return response as TResponse;
    } else if (options.url === "/games/user-config") {
      const userConfig: UserConfigT = {
        userId: "plrid-1",
        username: "username 1",
        minimalGameInstanceExposedInfos: devGameInstanceExposedInfos.map(e => ({
          ...e,
          minimalGameConfig: e.gameConfig,
        })),
      }
      const response: GetUserConfigResponseT = {
        userConfig: userConfig,
      }
      return response as TResponse;
    } else if (options.url === "/games/user-config/play-game") {
      const data: { gameConfigId: GameConfigIdT } = options.data as unknown as { gameConfigId: GameConfigIdT };
      const gameInstanceId: GameInstanceIdT | null = handlePlayGame(data.gameConfigId);
      if (gameInstanceId === null) {
        return {} as TResponse;
      }
      return { gameInstanceId: gameInstanceId } as TResponse;
    } else if (options.url === "/games/user-config/accept-invite") {
      const data: { invitationCode: string } = options.data as unknown as { invitationCode: string };
      const gameInstanceId: GameInstanceIdT | null = handleAcceptInvite(data.invitationCode);
      if (gameInstanceId === null) {
        throw new Error("Not found");
      }
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
      const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined = devGameInstanceExposedInfos.find(e =>
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
