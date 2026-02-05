
import { useAppErrorHandling } from '@ig/app-engine-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-engine-models';
import type React from 'react';
import { useState, type FC } from 'react';
import {
  useGameInstanceController
} from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import type { TestableComponentT } from '../../../../types/ComponentTypes';
import { LevelView } from './LevelView';

export type LevelsViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
};

export const LevelsView: FC<LevelsViewPropsT> = (props) => {
  const { gameInstanceExposedInfo } = props;
  const { gameState } = gameInstanceExposedInfo;
  const { onSubmitGuess } = useGameInstanceController();
  const { onUnknownError } = useAppErrorHandling();

  const unsolvedLevelIdx = gameState.levelStates.findIndex(e => e.levelStatus !== 'solved');
  const [curLevelIdx] = useState(unsolvedLevelIdx === -1 ?
    gameState.levelStates.length - 1 : unsolvedLevelIdx
  );

  const handleSubmitGuess = async (guess: string): Promise<boolean> => {
    try {
      const isCorrectGuess = await onSubmitGuess(gameInstanceExposedInfo.gameInstanceId, curLevelIdx, guess);

      return isCorrectGuess;
    } catch (error: unknown) {
      onUnknownError(error);
    }
    return false;
  }

  if (curLevelIdx === -1) {
    return null;
  }
  return <LevelView
    testID='LevelView-tid'
    levelState={gameState.levelStates[curLevelIdx]}
    onSubmitGuess={handleSubmitGuess}
  />;
};
