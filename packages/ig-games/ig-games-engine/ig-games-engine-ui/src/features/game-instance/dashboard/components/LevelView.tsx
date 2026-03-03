
import type { LevelStateT } from '@ig/games-engine-models';
import { WordleView } from '@ig/games-wordle-ui';
import type React from 'react';
import type { FC } from 'react';
import type { TestableComponentT } from '../../../../types/ComponentTypes';

export type LevelViewPropsT = TestableComponentT & {
  levelState: LevelStateT,
  onSubmitGuess: (guess: string) => Promise<boolean>,
};

export const LevelView: FC<LevelViewPropsT> = (props) => {
  const { levelState, onSubmitGuess } = props;

  if (levelState.pluginState.kind === 'wordle') {
    return <WordleView
      testID='WordleView-tid'
      publicWordleConfig={levelState.pluginState.publicWordleConfig}
      publicWordleState={levelState.pluginState.publicWordleState}
      levelStatus={levelState.levelStatus}
      onSubmitGuess={onSubmitGuess}
    />
  }

  return null;
};
