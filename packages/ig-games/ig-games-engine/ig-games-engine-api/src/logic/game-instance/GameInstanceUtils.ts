
import type { LevelStateT, PublicLevelConfigT } from '@ig/games-engine-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';

export const levelConfigTolevelState = (
  levelConfig: PublicLevelConfigT,
  wordleAdapter: WordleAdapter,
): LevelStateT => {
  if (levelConfig.publicPluginConfig.kind === 'code') {
    const levelState: LevelStateT = {
      levelStatus: 'notStarted',
      pluginState: {
        kind: 'code',
        publicCodePuzzleConfig: levelConfig.publicPluginConfig.publicCodePuzzleConfig,
        codeSolution: '',
      }
    }

    return levelState;
  } else if (levelConfig.publicPluginConfig.kind === 'wordle') {
    const levelState: LevelStateT = {
      levelStatus: 'notStarted',
      pluginState: {
        kind: 'wordle',
        publicWordleConfig: levelConfig.publicPluginConfig.publicWordleConfig,
        publicWordleState: {
          guessDatas: [],
        },
        wordleSolution: wordleAdapter.generateWordleSolution(levelConfig.publicPluginConfig.publicWordleConfig),
      }
    }

    return levelState;
  } else {
    throw new Error('Unexpected level kind');
  }
}
