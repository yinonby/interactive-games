
import { useAppLocalization, useGenericStyles } from '@ig/engine-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-models';
import { MS_TO_MIN } from '@ig/lib';
import { RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { GameStatusView } from '../../common/GameStatusView';
import { StartGameButton } from './StartGameButton';

export type GameInstanceConfigSummaryViewPropsT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  testID?: string,
};

export const GameInstanceConfigSummaryView: FC<GameInstanceConfigSummaryViewPropsT> = ({ gameInstanceExposedInfo }) => {
  const gameConfig = gameInstanceExposedInfo.gameConfig;
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();
  const durationMinStr =  gameConfig.maxDurationInfo.kind === 'limited' ?
    t('common:minutes', { minutes: MS_TO_MIN(gameConfig.maxDurationInfo.durationMs) }) :
    t('common:unlimited');

  return (
    <View style={genericStyles.verticalSpacing}>
      <View style={[genericStyles.flexRowAlignTop]} >
        <View style={[genericStyles.flex1, genericStyles.spacingEnd]}>
          <RnuiText testID='title-tid' variant='titleSmall' >
            {gameConfig.gameName}
          </RnuiText>
        </View>

        <GameStatusView testID='game-status-tid' gameStatus={gameInstanceExposedInfo.gameState.gameStatus} />
      </View>

      <RnuiText testID='duration-text-tid'>
        {t('common:duration') + ': ' + durationMinStr}
      </RnuiText>

      <RnuiText testID='max-participants-tid'>
        {t('games:maxParticipants') + ': ' +  gameConfig.maxParticipants}
      </RnuiText>

      {gameInstanceExposedInfo.gameState.gameStatus === 'not-started' &&
        <View style={[genericStyles.flexRowAlignTop]} >
          <StartGameButton testID='StartGameButton-tid' gameInstanceId={gameInstanceExposedInfo.gameInstanceId} />
        </View>
      }
    </View>
  );
};
