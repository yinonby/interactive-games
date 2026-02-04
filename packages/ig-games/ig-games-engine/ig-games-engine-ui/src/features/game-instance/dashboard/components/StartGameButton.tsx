
import { useAppErrorHandling, useAppLocalization } from '@ig/app-engine-ui';
import type { GameInstanceIdT } from '@ig/games-engine-models';
import { RnuiButton } from '@ig/rnui';
import React, { type FC } from 'react';
import {
  useGameInstanceController
} from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';
import type { TestableComponentT } from '../../../../types/ComponentTypes';

export type StartGameButtonPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const StartGameButton: FC<StartGameButtonPropsT> = (props) => {
  const { gameInstanceId } = props;
  const { t } = useAppLocalization();
  const { onStartGame } = useGameInstanceController();
  const { onUnknownError } = useAppErrorHandling();

  const handlePress = async (): Promise<void> => {
    try {
      await onStartGame(gameInstanceId);
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <RnuiButton testID="RnuiButton-tid" size="xs" onPress={handlePress}>{t('games:startGame')}</RnuiButton>
  )
};
