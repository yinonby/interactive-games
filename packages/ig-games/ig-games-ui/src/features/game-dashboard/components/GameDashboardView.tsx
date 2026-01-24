
import { useAppErrorHandling } from '@ig/engine-app-ui';
import type { GameConfigT } from '@ig/games-models';
import { RnuiActivityIndicator, RnuiCard, RnuiGrid, RnuiGridItem } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { useGameModel } from '../../../domains/game/model/rtk/GameModel';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameConfigCardView } from './GameConfigCardView';
import { GameInstanceSummaryView } from './GameInstanceSummaryView';

export type GameDashboardViewPropsT = TestableComponentT & {
  joinedGameConfig: GameConfigT,
};

export const GameDashboardView: FC<GameDashboardViewPropsT> = (props) => {
  const {
    isLoading,
    isError,
    appErrCode,
    data: gamesUserConfigModelData
  } = useGameModel(props.joinedGameConfig.gameConfigId);
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
        <GameConfigCardView testID='GameConfigCardView-tid' gameConfig={props.joinedGameConfig} />
      </RnuiGridItem>

      {gamesUserConfigModelData.gameInstanceIds.map((e, index) => (
        <RnuiGridItem key={"instance" + index} xs={14} sm={12} md={6} lg={4} xl={4} >
          <RnuiCard>
            <GameInstanceSummaryView
              testID='GameInstanceSummaryView-tid'
              gameInstanceId={e}
            />
          </RnuiCard>
        </RnuiGridItem>
      ))}
    </RnuiGrid>
  )
};
