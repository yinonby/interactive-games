
import type { GameUserLogicAdapter, GameUserTableAdapter } from '@ig/games-engine-be-models';
import type { AddGameConfigIdInputT, AddGameConfigIdResultT, GameUserIdT, GameUserT, PublicGameUserT } from '@ig/games-engine-models';

export class GameUserLogic implements GameUserLogicAdapter {
  constructor(
    private gameUserTableAdapter: GameUserTableAdapter,
  ) { }

  public async getGameUser(gameUserId: GameUserIdT): Promise<GameUserT | null> {
    return await this.gameUserTableAdapter.getGameUser(gameUserId);
  }

  public async getPublicGameUser(gameUserId: GameUserIdT): Promise<PublicGameUserT> {
    const gameUser = await this.gameUserTableAdapter.getGameUser(gameUserId);

    if (gameUser === null) {
      // create user if not found
      const newGameUser: GameUserT = {
        gameUserId,
        joinedGameConfigIds: [],
      }
      await this.gameUserTableAdapter.createGameUser(newGameUser);
      return newGameUser;
    } else {
      return gameUser;
    }
  }

  public async createGameUser(gameUserId: GameUserIdT): Promise<void> {
    const gameUser: GameUserT = {
      gameUserId,
      joinedGameConfigIds: [],
    }
    await this.gameUserTableAdapter.createGameUser(gameUser);
  }

  public async addGameConfigId(gameUserId: GameUserIdT, input: AddGameConfigIdInputT): Promise<AddGameConfigIdResultT> {
    const { gameConfigId } = input;
    await this.gameUserTableAdapter.addGameConfigId(gameUserId, gameConfigId);

    return {
      gameUserId: gameUserId,
    }
  }
}
