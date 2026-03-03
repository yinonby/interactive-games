
import {
  type GameConfigsTableAdapter, type GameInstanceLogicAdapter,
  type GameInstancesTableAdapter, type GamesUserAdapter
} from '@ig/games-engine-be-models';
import type {
  CreateGameInstanceInputT,
  GameConfigIdT,
  GameInstanceIdT,
  GameInstanceT,
  GameUserIdT,
  JoinGameByInviteInputT,
  LevelStateT,
  PublicGameConfigT,
  PublicGameInstanceT,
  PublicPlayerInfoT,
  StartPlayingInputT,
  SubmitGuessInputT,
  WordleLevelStateT
} from '@ig/games-engine-models';
import { analyzeWordleGuess } from '@ig/games-wordle-be-logic';
import { type WordleAdapter } from '@ig/games-wordle-be-models';
import { generateUuidv4 } from '@ig/utils';
import { GamesApiError } from '../../types/GamesPluginTypes';
import { analyzeCodePuzzleGuess } from './CodePuzzleLogic';
import { levelConfigTolevelState } from './GameInstanceUtils';

export class GameInstanceLogic implements GameInstanceLogicAdapter {
  constructor(
    private gameInstancesTableAdapter: GameInstancesTableAdapter,
    private gameConfigsTableAdapter: GameConfigsTableAdapter,
    private gamesUserAdapter: GamesUserAdapter,
    private wordleAdapter: WordleAdapter,
  ) { }

  public async getGameInstanceIdsForGameConfig(
    gameUserId: GameUserIdT,
    args: { gameConfigId: GameConfigIdT }
  ): Promise<GameInstanceIdT[]> {
    const { gameConfigId } = args;

    // TODO: add directive isGamePlayer

    return await this.gameInstancesTableAdapter.getGameInstanceIdsForGameConfig(gameConfigId);
  }

  public async getPublicGameInstance(
    gameUserId: GameUserIdT,
    args: { gameInstanceId: GameInstanceIdT }
  ): Promise<PublicGameInstanceT> {
    const { gameInstanceId } = args;

    // TODO: add directive isGamePlayer

    const publicGameInstance: PublicGameInstanceT | null =
      await this.gameInstancesTableAdapter.getPublicGameInstance(gameInstanceId);

    if (publicGameInstance === null) {
      throw new GamesApiError('Game instance not found', 'gamesApiError:gameInstanceNotFound');
    }
    return publicGameInstance;
  }

  public async createGameInstance(
    gameUserId: GameUserIdT,
    args: CreateGameInstanceInputT,
  ): Promise<GameInstanceIdT> {
    const { gameConfigId } = args;
    const gameInstanceId = 'GI-' + generateUuidv4().slice(0, 8);

    const publicGameConfig: PublicGameConfigT | null = await this.gameConfigsTableAdapter.getGameConfig(gameConfigId);
    if (publicGameConfig === null) {
      throw new GamesApiError('Game config not found', 'gamesApiError:gameConfigNotFound');
    }

    const { playerNickname } = await this.gamesUserAdapter.retrieveGameUserInfo(gameUserId);
    if (playerNickname === null) {
      throw new GamesApiError('Cannot retrieve player nickname', 'gamesApiError:cannotRetrievePlayerNickname');
    }

    const levelStates: LevelStateT[] = publicGameConfig.publicLevelConfigs.map(e =>
      levelConfigTolevelState(e, this.wordleAdapter));

    const gameInstance: GameInstanceT = {
      gameInstanceId: gameInstanceId,
      invitationCode: 'INVT-' + generateUuidv4(),
      publicGameConfig: publicGameConfig,
      gameState: {
        gameStatus: 'notStarted',
        levelStates: levelStates,
      },
      publicPlayerInfos: [{
        playerId: gameUserId,
        playerNickname: playerNickname,
        playerRole: 'admin',
        playerStatus: 'active',
      }],
    }
    await this.gameInstancesTableAdapter.createGameInstance(gameInstance);

    return gameInstanceId;
  }

  public async joinGameByInvite(
    gameUserId: GameUserIdT,
    args: JoinGameByInviteInputT,
  ): Promise<GameInstanceIdT> {
    const { invitationCode } = args;

    const gameInstance: GameInstanceT | null =
      await this.gameInstancesTableAdapter.getGameInstanceByInvitationCode(invitationCode);

    if (gameInstance === null) {
      throw new GamesApiError('Invalid invitation code', 'gamesApiError:invalidInvitationCode');
    }

    const { playerNickname } = await this.gamesUserAdapter.retrieveGameUserInfo(gameUserId);
    if (playerNickname === null) {
      throw new GamesApiError('Cannot retrieve player nickname', 'gamesApiError:cannotRetrievePlayerNickname');
    }

    const publicPlayerInfo: PublicPlayerInfoT = {
      playerId: gameUserId,
      playerNickname: playerNickname,
      playerRole: 'player',
      playerStatus: 'active',
    }
    await this.gameInstancesTableAdapter.addPlayer(gameInstance.gameInstanceId, publicPlayerInfo);

    return gameInstance.gameInstanceId;
  }

  public async startPlaying(
    gameUserId: GameUserIdT,
    args: StartPlayingInputT,
  ): Promise<void> {
    const { gameInstanceId } = args;

    // TODO: add directive isGameAdmin
    await this.gameInstancesTableAdapter.startPlaying(gameInstanceId);
  }

  public async submitGuess(
    gameUserId: GameUserIdT,
    args: SubmitGuessInputT,
  ): Promise<boolean> {
    const { gameInstanceId, levelIdx, guess } = args;

    const gameInstance: GameInstanceT | null =
      await this.gameInstancesTableAdapter.getGameInstance(gameInstanceId);

    if (gameInstance === null) {
      throw new GamesApiError('Invalid invitation code', 'gamesApiError:invalidInvitationCode');
    }

    if (levelIdx >= gameInstance.gameState.levelStates.length) {
      throw new GamesApiError('Invalid levelIdx', 'gamesApiError:invalidInput');
    }

    const levelState = gameInstance.gameState.levelStates[levelIdx];

    if (levelState.pluginState.kind === 'code') {
      const { isCorrectGuess } = analyzeCodePuzzleGuess(levelState.pluginState, guess);
      const newLevelState: LevelStateT = {
        ...levelState,
        levelStatus: isCorrectGuess ? 'solved' : 'levelInProcess'
      }

      await this.gameInstancesTableAdapter.updateLevelState(gameInstanceId, levelIdx, newLevelState);
      return isCorrectGuess;
    } else {
      const { newPublicWordleState, isCorrectGuess, isWordleFailed } = analyzeWordleGuess({
        ...levelState.pluginState,
        guess,
      });
      const newPluginState: WordleLevelStateT = {
        ...levelState.pluginState,
        publicWordleState: newPublicWordleState,
      }
      const newLevelState: LevelStateT = {
        ...levelState,
        levelStatus: isCorrectGuess ? 'solved' : (isWordleFailed ? 'failed' : 'levelInProcess'),
        solvedTimeTs: Date.now(),
        pluginState: newPluginState,
      }
      await this.gameInstancesTableAdapter.updateLevelState(gameInstanceId, levelIdx, newLevelState);
      return isCorrectGuess;
    }
  }
}
