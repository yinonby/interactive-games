/* istanbul ignore file -- @preserve */

import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import type { AccountIdT, AccountT } from '@ig/app-engine-models';
import type { SignupPluginAdapter } from '@ig/auth-be-models';
import type { AuthIdT } from '@ig/auth-models';
import type { ExpressPluginContainerT, PackageDb } from '@ig/be-utils';
import { gamesApiPlugin, type GamesPluginConfigT } from '@ig/games-engine-api';
import type { GamesDbAdapter, GamesRequestAdapter, GamesUserAdapter } from '@ig/games-engine-be-models';
import type { GameUserIdT } from '@ig/games-engine-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import type { PublicWordleConfigT, WordleSolutionConfigT } from '@ig/games-wordle-models';
import type { Request } from 'express';
import * as enWordleConfigJson from '../../assets/wordle/en.wordle-config.json';
import { loadGameConfigPreset1 } from '../presets/GameConfigsPreset';
import { isDevel } from '../utils/Utils';
import { useSignupPluginAdapter } from './AuthPlugin';

export const useGamesPluginContainer = (
  gamesDb: PackageDb & GamesDbAdapter,
  engineDbAdapter: EngineDbAdapter,
): ExpressPluginContainerT<GamesPluginConfigT> => {
  const gamesRequestAdapter: GamesRequestAdapter = useGamesRequestAdapter();
  const gamesUserAdapter: GamesUserAdapter = useGamesPlayerInfoAdapter(engineDbAdapter);
  const wordleAdapter: WordleAdapter = useWordleAdapter();

  const gamesPluginContainer: ExpressPluginContainerT<GamesPluginConfigT> = {
    getPackageDb: () => gamesDb,
    routeConfig: {
      route: '/api/games',
      expressPlugin: gamesApiPlugin,
      publicPluginConfig: {
        gamesDbAdapter: gamesDb,
        gamesRequestAdapter,
        gamesUserAdapter,
        wordleAdapter,
      },
    },
    postInitCb: loadPresets,
  }

  return gamesPluginContainer;
}

const useGamesRequestAdapter = (): GamesRequestAdapter => {
  const getSignupPluginAdapter: SignupPluginAdapter = useSignupPluginAdapter();

  return {
    extractGameUserId: (req: Request): GameUserIdT | null => {
      const authId: AuthIdT | null = getSignupPluginAdapter.extractRequestAuthId(req);
      if (authId === null) {
        return null;
      }
      return authId as GameUserIdT;
    }
  }
}

const useGamesPlayerInfoAdapter = (engineDbAdapter: EngineDbAdapter): GamesUserAdapter => {
  return {
    retrieveGameUserInfo: async (gameUserId: GameUserIdT): Promise<{ playerNickname: string | null }> => {
      const accountsTableAdapter = engineDbAdapter.getAccountsTableAdapter();
      const accountId: AccountIdT = gameUserId as AccountIdT;
      const account: AccountT | null = await accountsTableAdapter.getAccount(accountId);

      if (account === null) {
        return { playerNickname: null };
      }
      return { playerNickname: account.nickname };
    }
  }
}

const useWordleAdapter = (): WordleAdapter => {
  return {
    generateWordleSolution: (publicWordleConfig: PublicWordleConfigT): string => {
      if (publicWordleConfig.wordLength === 5) {
        const solutionConfig: WordleSolutionConfigT = enWordleConfigJson['5letters'];
        const options = solutionConfig[publicWordleConfig.difficulty];
        return options[Math.floor(Math.random() * options.length)];
      }

      throw new Error('Unsupported wordle config');
    }
  }
}

const loadPresets = async (gamesPluginConfig: GamesPluginConfigT): Promise<void> => {
  if (isDevel()) {
    const presetNamesStr = process.env.DEV_PRESETS;
    if (presetNamesStr === undefined) {
      return;
    }

    const presetNames = presetNamesStr.split(',');
    if (presetNamesStr === 'all' || presetNames.includes('game-infos-preset-1')) {
      await loadGameConfigPreset1(gamesPluginConfig.gamesDbAdapter);
    }
  }
}