
import { useAppLocalization, useGenericStyles } from '@ig/engine-app-ui';
import type { GameInstanceExposedInfoT } from '@ig/engine-models';
import { RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { GameStatusView } from '../../common/GameStatusView';
import { StartGameButtonLink } from './StartGameButtonLink';

export type GameInstanceConfigSummaryViewPropsT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  testID?: string,
};

export const GameInstanceConfigSummaryView: FC<GameInstanceConfigSummaryViewPropsT> = ({ gameInstanceExposedInfo }) => {
  const gameConfig = gameInstanceExposedInfo.gameConfig;
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();

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
        {t('common:duration') + ': ' + t('common:minutes', { minutes: gameConfig.maxDurationMinutes })}
      </RnuiText>

      <RnuiText testID='max-participants-tid'>
        {t('games:maxParticipants') + ': ' +  gameConfig.maxParticipants}
      </RnuiText>

      <View style={[genericStyles.flexRowAlignTop]} >
        <StartGameButtonLink testID='StartGameButtonLink-tid' gameInstanceId={gameInstanceExposedInfo.gameInstanceId} />
      </View>
    </View>
  );
};
