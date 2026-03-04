
import { useGenericStyles } from '@ig/app-engine-ui';
import type { GameInstanceIdT } from '@ig/games-engine-models';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { useGameInstanceModel } from '../../../domains/game-instance/model/rtk/GameInstanceModel';
import { ModelLoadingView } from '../../../features/common/ModelLoadingView';
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
  const genericStyles = useGenericStyles();

  if (isLoading || isError) {
    return (
      <ModelLoadingView
        testID='ModelLoadingView-tid'
        isLoading={isLoading}
        appErrCode={isError ? appErrCode : null}
      />
    );
  }

  return (
    <View style={genericStyles.spacing}>
      <GameStatusView
        testID="GameStatusView-tid"
        gameStatus={gameInstanceModelData.publicGameInstance.gameState.gameStatus}
      />

      <PlayersTableView
        testID='PlayersTableView-tid'
        publicPlayerInfos={gameInstanceModelData.publicGameInstance.publicPlayerInfos}
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
