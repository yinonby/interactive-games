
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { PublicGameInstanceT } from '@ig/games-engine-models';
import { RnuiText } from '@ig/rnui';
import { MS_TO_MIN } from '@ig/utils';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { GameStatusView } from '../../common/GameStatusView';
import { StartGameButton } from './StartGameButton';

export type GameInstanceConfigSummaryViewPropsT = {
  publicGameInstance: PublicGameInstanceT,
  testID?: string,
};

export const GameInstanceConfigSummaryView: FC<GameInstanceConfigSummaryViewPropsT> = ({ publicGameInstance }) => {
  const publicGameConfig = publicGameInstance.publicGameConfig;
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();
  const durationMinStr = publicGameConfig.maxDurationInfo.kind === 'limited' ?
    t('common:minutes', { minutes: MS_TO_MIN(publicGameConfig.maxDurationInfo.durationMs) }) :
    t('common:unlimited');

  return (
    <View style={genericStyles.spacing}>
      <View style={[genericStyles.flexRowAlignTop]} >
        <View style={[genericStyles.flex1]}>
          <RnuiText testID='title-tid' variant='titleSmall' >
            {publicGameConfig.gameName}
          </RnuiText>
        </View>

        <GameStatusView testID='game-status-tid' gameStatus={publicGameInstance.gameState.gameStatus} />
      </View>

      <RnuiText testID='duration-text-tid'>
        {t('common:duration') + ': ' + durationMinStr}
      </RnuiText>

      <RnuiText testID='max-participants-tid'>
        {t('games:maxParticipants') + ': ' +  publicGameConfig.maxParticipants}
      </RnuiText>

      {publicGameInstance.gameState.gameStatus === 'notStarted' &&
        <View style={[genericStyles.flexRowAlignTop]} >
          <StartGameButton testID='StartGameButton-tid' gameInstanceId={publicGameInstance.gameInstanceId} />
        </View>
      }
    </View>
  );
};
