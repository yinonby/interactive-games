
import {
  type GameConfigIdT, type GameConfigT, type GameInstanceChatMessageT,
  type GameInstanceExposedInfoT, type GameInstanceIdT,
  type GamesUserConfigT,
  type GetGameInstanceChatResponseT,
  type GetGameInstanceResponseT,
  type GetGamesUserConfigResponseT,
  type LevelExposedConfigT,
  type LevelStateT,
  type PostGameInstanceChatMessageParamsT,
  type PostGameInstanceChatMessageResponseT,
  type PostGameInstanceStartResponseT,
  type PostGameInstanceSubmitGuessResponseT
} from '@ig/games-engine-models';
import type { LetterAnalysisT } from '@ig/games-wordle-models';
import { generateUuidv4, type LoggerAdapter } from '@ig/utils';
import type { HttpAdapter, HttpMethod } from '../../../../ig-lib/ig-client-lib/ig-client-utils';
import { getLocalUserId } from '../../src/app/layout/AppConfigUtils';
import { useClientLogger } from '../../src/app/providers/useClientLogger';
import {
  devAllGameConfigs,
  devAllGameInstanceExposedInfos,
  devChatMessages,
  devJoinedGameConfigs
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
    playerNickname: 'Jim Curry',
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

  const levelConfigTolevelState = (levelConfig: LevelExposedConfigT): LevelStateT | null => {
    if (levelConfig.kind === 'wordle') {
      const levelState: LevelStateT = {
        levelStatus: 'notStarted',
        kind: 'wordle',
        wordleExposedConfig: levelConfig.wordleExposedConfig,
        wordleState: {
          guessDatas: [],
        },
      }

      return levelState;
    } else {
      return null;
    }
  }

  const levelStates: LevelStateT[] = joinedGameConfig.levelExposedConfigs
    .map(e => levelConfigTolevelState(e))
    .filter(e => e !== null);

  const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
    gameInstanceId: gameInstanceId,
    invitationCode: 'invt-code-' + gameInstanceId,
    gameConfig: joinedGameConfig,
    gameState: {
      gameStatus: 'notStarted',
      levelStates: levelStates,
    },
    playerExposedInfos: [{
      playerUserId: curUserId,
      playerNickname: 'Jim Curry',
      playerRole: 'admin',
      playerStatus: 'active',
    }],
  }

  devAllGameInstanceExposedInfos.push(gameInstanceExposedInfo);

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
  if (gameInstanceExposedInfo.gameState.gameStatus !== 'notStarted') {
    throw new Error('Game already started');
  }

  const gameState = {...gameInstanceExposedInfo.gameState};
  const newLevelStates: LevelStateT[] = gameState.levelStates.map((state, idx) =>
    (idx === 0) ? {
      ...state,
      levelStatus:'levelInProcess',
      startTimeTs: Date.now(),
    } : state
  );

  gameInstanceExposedInfo.gameState = {
    ...gameInstanceExposedInfo.gameState,
    gameStatus: 'inProcess',
    startTimeTs: Date.now(),
    levelStates: newLevelStates,
  };
}

const getGameInstanceChatMessages = (gameInstanceId: GameInstanceIdT): GameInstanceChatMessageT[] => {
  return devChatMessages.filter(e => e.gameInstanceId === gameInstanceId).sort((e1, e2) => e1.sentTs - e2.sentTs);
}

const handleSubmitGuess = (gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string): boolean => {
  const gameInstanceExposedInfo: GameInstanceExposedInfoT | undefined = devAllGameInstanceExposedInfos.find(e =>
    e.gameInstanceId === gameInstanceId
  );
  if (gameInstanceExposedInfo === undefined) {
    throw new Error('Game instance not found');
  }
  if (gameInstanceExposedInfo.gameState.gameStatus !== 'inProcess') {
    throw new Error('Game not in process');
  }
  const gameState = {...gameInstanceExposedInfo.gameState};
  const tmpCorrectGuess = 'WORLD';
  const lowercaseSolution = tmpCorrectGuess.toLowerCase();
  const lowercaseGuess = guess.toLowerCase();
  const isCorrectGuess = lowercaseGuess === lowercaseSolution;
  const isLastLevel = levelIdx === gameState.levelStates.length - 1;
  const isLastGuess = gameState.levelStates[levelIdx].wordleState.guessDatas.length >=
    gameState.levelStates[levelIdx].wordleExposedConfig.allowedGuessesNum - 1;

  const letterAnalyses: LetterAnalysisT[] = [];
  for (let i = 0; i < lowercaseSolution.length; i++) {
    const guessLetter = lowercaseGuess[i].toLowerCase();
    const correctLetter = lowercaseSolution[i];
    if (guessLetter === correctLetter) {
      letterAnalyses.push('hit');
    } else if (lowercaseSolution.includes(guessLetter)) {
      letterAnalyses.push('present');
    } else {
      letterAnalyses.push('notPresent');
    }
  }

  const newLevelStates: LevelStateT[] = gameState.levelStates.map((state, idx) =>
    (idx === levelIdx && state.kind === 'wordle') ? {
      ...state,
      levelStatus: isCorrectGuess ? 'solved' : (isLastGuess ? 'failed' : 'levelInProcess'),
      solvedTimeTs: Date.now(),
      wordleState: {
        ...state.wordleState,
        guessDatas: [...state.wordleState.guessDatas, {
          guess: guess,
          letterAnalyses: letterAnalyses,
        }],
        correctSolution: isLastGuess ? tmpCorrectGuess : undefined,
      }
    } : state
  );

  gameInstanceExposedInfo.gameState = {
    ...gameState,
    gameStatus: (isLastLevel && (isCorrectGuess || isLastGuess)) ? 'ended' : 'inProcess',
    levelStates: newLevelStates,
  };

  return isCorrectGuess;
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

    if (options.url === '/games/user-config') {
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
    } else if (options.url.startsWith('/games/game-instance/') && options.url.endsWith('submit-guess')) {
      const gameInstanceId: GameInstanceIdT = options.url.split('/')[3] as GameInstanceIdT;
      const data = options.data as { levelIdx: number, guess: string };

      const isGuessCorrect = handleSubmitGuess(gameInstanceId, data.levelIdx, data.guess);

      const response: PostGameInstanceSubmitGuessResponseT = {
        isGuessCorrect: isGuessCorrect,
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
