
import {
  type GameConfigIdT,
  type GameInstanceIdT,
  type GamesUserConfigT,
  type GetGameInstanceResponseT,
  type GetGamesUserConfigResponseT,
  type LevelStateT,
  type PostGameInstanceStartResponseT,
  type PostGameInstanceSubmitGuessResponseT,
  type PublicGameConfigT,
  type PublicGameInstanceT,
  type PublicLevelConfigT
} from '@ig/games-engine-models';
import type { LetterAnalysisT } from '@ig/games-wordle-models';
import { generateUuidv4, type LoggerAdapter } from '@ig/utils';
import type { HttpAdapter, HttpMethod } from '../../../../ig-lib/ig-client-lib/ig-client-utils';
import { getLocalAccountId } from '../../src/app/layout/AppConfigUtils';
import { useClientLogger } from '../../src/app/providers/useClientLogger';
import {
  devAllGameConfigs,
  devAllGameInstanceExposedInfos,
  devJoinedGameConfigs
} from './DevMocks';

const tmpCorrectGuess = 'WORLD';

const handlePlayGame = async (gameConfigId: GameConfigIdT): Promise<void> => {
  const publicGameConfig: PublicGameConfigT | undefined =
    devAllGameConfigs.find(e => e.gameConfigId === gameConfigId);

  if (publicGameConfig === undefined) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  const joinedPublicGameConfig: PublicGameConfigT | undefined =
    devJoinedGameConfigs.find(e => e.gameConfigId === gameConfigId);

  if (joinedPublicGameConfig !== undefined) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  devJoinedGameConfigs.push(publicGameConfig);
}

const handleAcceptInvite = async (invitationCode: string): Promise<string> => {
  const publicGameInstance: PublicGameInstanceT | undefined =
    devAllGameInstanceExposedInfos.find(e => e.invitationCode === invitationCode);

  if (publicGameInstance === undefined) {
    throw { status: 500, apiErrCode: 'gamesApiError:invalidInvitationCode' };
  }

  const curAccountId = await getLocalAccountId();
  if (curAccountId === null) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  if (publicGameInstance.publicPlayerInfos.find(e => e.playerAccountId === curAccountId)) {
    throw { status: 500, apiErrCode: 'gamesApiError:gameInstanceAlreadyJoined' };
  }

  publicGameInstance.publicPlayerInfos.push({
    playerAccountId: curAccountId,
    playerNickname: 'Jim Curry',
    playerRole: 'player',
    playerStatus: 'active',
  });

  return publicGameInstance.gameInstanceId;
}

const handleCreateGameInstance = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT> => {
  const gameInstanceId = 'giid-' + gameConfigId + '-' + generateUuidv4().slice(0, 8);
  const curAccountId = await getLocalAccountId();

  if (curAccountId === null) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  const joinedPublicGameConfig: PublicGameConfigT | undefined =
    devJoinedGameConfigs.find(e => e.gameConfigId === gameConfigId);

  if (joinedPublicGameConfig === undefined) {
    throw { status: 500, apiErrCode: 'apiError:server' };
  }

  const levelConfigTolevelState = (levelConfig: PublicLevelConfigT): LevelStateT | null => {
    if (levelConfig.kind === 'wordle') {
      const levelState: LevelStateT = {
        levelStatus: 'notStarted',
        kind: 'wordle',
        publicWordleConfig: levelConfig.publicWordleConfig,
        publicWordleState: {
          guessDatas: [],
        },
        wordleSolution: tmpCorrectGuess,
      }

      return levelState;
    } else {
      return null;
    }
  }

  const levelStates: LevelStateT[] = joinedPublicGameConfig.publicLevelConfigs
    .map(e => levelConfigTolevelState(e))
    .filter(e => e !== null);

  const publicGameInstance: PublicGameInstanceT = {
    gameInstanceId: gameInstanceId,
    invitationCode: 'invt-code-' + gameInstanceId,
    publicGameConfig: joinedPublicGameConfig,
    gameState: {
      gameStatus: 'notStarted',
      levelStates: levelStates,
    },
    publicPlayerInfos: [{
      playerAccountId: curAccountId,
      playerNickname: 'Jim Curry',
      playerRole: 'admin',
      playerStatus: 'active',
    }],
  }

  devAllGameInstanceExposedInfos.push(publicGameInstance);

  return gameInstanceId;
}

const getGameInstanceIds = async (gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]> => {
  return devAllGameInstanceExposedInfos.filter(e => e.publicGameConfig.gameConfigId === gameConfigId)
    .map(e => e.gameInstanceId);
}

const handleStartGame = (gameInstanceId: GameInstanceIdT): void => {
  const publicGameInstance: PublicGameInstanceT | undefined = devAllGameInstanceExposedInfos.find(e =>
    e.gameInstanceId === gameInstanceId
  );
  if (publicGameInstance === undefined) {
    throw new Error('Game instance not found');
  }
  if (publicGameInstance.gameState.gameStatus !== 'notStarted') {
    throw new Error('Game already started');
  }

  const gameState = {...publicGameInstance.gameState};
  const newLevelStates: LevelStateT[] = gameState.levelStates.map((state, idx) =>
    (idx === 0) ? {
      ...state,
      levelStatus:'levelInProcess',
      startTimeTs: Date.now(),
    } : state
  );

  publicGameInstance.gameState = {
    ...publicGameInstance.gameState,
    gameStatus: 'inProcess',
    startTimeTs: Date.now(),
    levelStates: newLevelStates,
  };
}

const handleSubmitGuess = (gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string): boolean => {
  const publicGameInstance: PublicGameInstanceT | undefined = devAllGameInstanceExposedInfos.find(e =>
    e.gameInstanceId === gameInstanceId
  );
  if (publicGameInstance === undefined) {
    throw new Error('Game instance not found');
  }
  if (publicGameInstance.gameState.gameStatus !== 'inProcess') {
    throw new Error('Game not in process');
  }
  const gameState = {...publicGameInstance.gameState};
  const lowercaseSolution = tmpCorrectGuess.toLowerCase();
  const lowercaseGuess = guess.toLowerCase();
  const isCorrectGuess = lowercaseGuess === lowercaseSolution;
  const isLastLevel = levelIdx === gameState.levelStates.length - 1;
  const isLastGuess = gameState.levelStates[levelIdx].kind !== 'wordle' ? false :
    gameState.levelStates[levelIdx].publicWordleState.guessDatas.length >=
      gameState.levelStates[levelIdx].publicWordleConfig.allowedGuessesNum - 1;

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
      publicWordleState: {
        ...state.publicWordleState,
        guessDatas: [...state.publicWordleState.guessDatas, {
          guess: guess,
          letterAnalyses: letterAnalyses,
        }],
        correctGuess: isLastGuess ? tmpCorrectGuess : undefined,
      },
    } : state
  );

  publicGameInstance.gameState = {
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
        joinedPublicGameConfigs: [...devJoinedGameConfigs], // clone this array so it is not frozen
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
      const publicGameInstance: PublicGameInstanceT | undefined = devAllGameInstanceExposedInfos.find(e =>
        e.gameInstanceId === gameInstanceId
      );
      if (publicGameInstance === undefined) {
        throw new Error('Game instance not found');
      }
      const response: GetGameInstanceResponseT = {
        publicGameInstance: {...publicGameInstance}, // clone this array so it is not frozen
      }
      return response as TResponse;
    } else {
      return {} as TResponse;
    }
  }
}
