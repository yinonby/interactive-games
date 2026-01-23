
import { useAppErrorHandling } from '@ig/engine-app-ui';
import type { GameConfigT } from '@ig/engine-models';
import { RnuiActivityIndicator, RnuiCard, RnuiGrid, RnuiGridItem } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { useGamesUserConfigModel } from '../../../domains/user-config/model/rtk/GamesUserConfigModel';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameConfigCardView } from './GameConfigCardView';
import { GameInstanceView } from './GameInstanceView';

export type GameDashboardViewPropsT = TestableComponentT & {
  joinedGameConfig: GameConfigT,
};

export const GameDashboardView: FC<GameDashboardViewPropsT> = (props) => {
  const { isLoading, isError, appErrCode, data: gamesUserConfigModelData } = useGamesUserConfigModel();
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

  const minimalGameInstanceExposedInfos = gamesUserConfigModelData.gamesUserConfig.minimalGameInstanceExposedInfos;

  return (
    <RnuiGrid>
      <RnuiGridItem key="summary" xs={12} sm={12} md={6} lg={4} xl={4} >
        <GameConfigCardView testID='GameConfigCardView-tid' gameConfig={props.joinedGameConfig} />
      </RnuiGridItem>

      {minimalGameInstanceExposedInfos.map((e, index) => (
        <RnuiGridItem key={"instance" + index} xs={14} sm={12} md={6} lg={4} xl={4} >
          <RnuiCard>
            <GameInstanceView
              testID='GameInstanceView-tid'
              minimalGameInstanceExposedInfo={e}
            />
          </RnuiCard>
        </RnuiGridItem>
      ))}
    </RnuiGrid>
  )
};
