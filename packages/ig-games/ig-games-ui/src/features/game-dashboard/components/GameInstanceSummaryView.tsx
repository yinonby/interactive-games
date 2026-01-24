
import { useAppErrorHandling, useGenericStyles } from '@ig/engine-app-ui';
import type { GameInstanceIdT } from '@ig/games-models';
import { RnuiActivityIndicator } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { View } from 'react-native';
import { useGameInstanceModel } from '../../../domains/game-instance/model/rtk/GameInstanceModel';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameStatusView } from '../../game-instance/common/GameStatusView';
import { PlayersTableView } from '../../game-instance/dashboard/components/PlayersTableView';
import { OpenGameInstanceButtonLink } from './OpenGameInstanceButtonLink';

export type GameInstanceSummaryViewPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const GameInstanceSummaryView: FC<GameInstanceSummaryViewPropsT> = (props) => {
  const { gameInstanceId } = props;
  const { isLoading, isError, appErrCode, data: gameInstanceModelData } = useGameInstanceModel(gameInstanceId);
  const { onAppError } = useAppErrorHandling();
  const genericStyles = useGenericStyles();

  useEffect(() => {
    if (isError) {
      onAppError(appErrCode);
    }
  }, [isError, onAppError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="RnuiActivityIndicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  return (
    <View style={genericStyles.verticalSpacing}>
      <GameStatusView
        testID="GameStatusView-tid"
        gameStatus={gameInstanceModelData.gameInstanceExposedInfo.gameState.gameStatus}
      />

      <PlayersTableView
        testID='PlayersTableView-tid'
        playerExposedInfos={gameInstanceModelData.gameInstanceExposedInfo.playerExposedInfos}
        withAdminButtons={false}
      />

      <View style={genericStyles.flexRowReverse}>
        <OpenGameInstanceButtonLink
          testID='OpenGameInstanceButtonLink-tid'
          gameInstanceId={gameInstanceId}
        />
      </View>
    </View>
  )
};
