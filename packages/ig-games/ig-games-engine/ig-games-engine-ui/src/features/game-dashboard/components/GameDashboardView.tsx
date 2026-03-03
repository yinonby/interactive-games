
import { useAppErrorHandling } from '@ig/app-engine-ui';
import type { GameConfigIdT } from '@ig/games-engine-models';
import { RnuiActivityIndicator, RnuiCard, RnuiGrid, RnuiGridItem } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { View } from 'react-native';
import { useGameConfigModel } from '../../../domains/game-config/model/rtk/GameConfigModel';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameConfigCardView } from './GameConfigCardView';
import { GameInstanceSummaryView } from './GameInstanceSummaryView';

export type GameDashboardViewPropsT = TestableComponentT & {
  gameConfigId: GameConfigIdT,
};

export const GameDashboardView: FC<GameDashboardViewPropsT> = (props) => {
  const {
    isLoading,
    isError,
    appErrCode,
    data: gameConfigModel
  } = useGameConfigModel(props.gameConfigId);
  const { onAppError } = useAppErrorHandling();

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
    <RnuiGrid>
      <RnuiGridItem key="summary" xs={12} sm={12} md={6} lg={4} xl={4} >
        <View>
          <GameConfigCardView testID='GameConfigCardView-tid' publicGameConfig={gameConfigModel.publicGameConfig} />
        </View>
      </RnuiGridItem>

      <RnuiGridItem key="instances" xs={12} sm={12} md={6} lg={8} xl={8} >
        <RnuiGrid>
          {gameConfigModel.gameInstanceIds.map((e, index) => (
            <RnuiGridItem key={"instance" + index} xs={12} sm={12} md={12} lg={6} xl={6} >
              <RnuiCard>
                <GameInstanceSummaryView
                  testID='GameInstanceSummaryView-tid'
                  gameInstanceId={e}
                />
              </RnuiCard>
            </RnuiGridItem>
          ))}
        </RnuiGrid>
      </RnuiGridItem>
    </RnuiGrid>
  )
};
