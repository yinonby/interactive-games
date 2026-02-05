
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-engine-models';
import { RnuiText } from '@ig/rnui';
import { MS_TO_MIN } from '@ig/utils';
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
    <View style={genericStyles.spacing}>
      <View style={[genericStyles.flexRowAlignTop]} >
        <View style={[genericStyles.flex1]}>
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

      {gameInstanceExposedInfo.gameState.gameStatus === 'notStarted' &&
        <View style={[genericStyles.flexRowAlignTop]} >
          <StartGameButton testID='StartGameButton-tid' gameInstanceId={gameInstanceExposedInfo.gameInstanceId} />
        </View>
      }
    </View>
  );
};
