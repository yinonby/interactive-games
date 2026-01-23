
import { useGenericStyles } from "@ig/engine-app-ui";
import type { MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameStatusView } from '../../game-instance/common/GameStatusView';
import { PlayersTableView } from '../../game-instance/dashboard/components/PlayersTableView';

export type GameInstanceSummaryViewPropsT = TestableComponentT & {
  minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT,
};

export const GameInstanceSummaryView: FC<GameInstanceSummaryViewPropsT> = (props) => {
  const { minimalGameInstanceExposedInfo } = props;
  const genericStyles = useGenericStyles();

  return (
    <View style={genericStyles.verticalSpacing}>
      <GameStatusView testID="GameStatusView-tid" gameStatus={minimalGameInstanceExposedInfo.gameStatus}/>

      <PlayersTableView
        testID='PlayersTableView-tid'
        playerExposedInfos={minimalGameInstanceExposedInfo.playerExposedInfos}
        withAdminButtons={false}
      />
    </View>
  );
};
