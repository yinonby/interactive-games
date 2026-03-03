
import { useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { GameConfigIdT, MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { RnuiActivityIndicator, RnuiGridItem, RnuiMasonryGrid, RnuiText } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { View } from 'react-native';
import { useGameUserModel } from '../../../domains/game-user/model/rtk/GameUserModel';
import { useGamesAppModel } from '../../../domains/games-app/model/rtk/GamesAppModel';
import { JoinableGameCardView } from './JoinableGameCardView';

const getNonJoinedMinimalGameConfigs = (
  availableMinimalPublicGameConfigs: MinimalPublicGameConfigT[],
  joinedPublicGameConfigIds: GameConfigIdT[],
): MinimalPublicGameConfigT[] => {
  return availableMinimalPublicGameConfigs.filter(e => !joinedPublicGameConfigIds.find(e2 => e2 === e.gameConfigId));
};

export type AvailableGamesViewPropsT = object;

export const AvailableGamesView: FC<AvailableGamesViewPropsT> = () => {
  const { t } = useAppLocalization();
  const { onAppError } = useAppErrorHandling();
  const {
    isLoading: isAppConfigLoading,
    isError: isAppConfigError,
    appErrCode: appConfigErrCode,
    data: gamesConfigModel
  } = useGamesAppModel();
  const {
    isLoading: gameUserModel_isLoading,
    isError: gameUserModel_isError,
    appErrCode: gameUserModel_appErrCode,
    data: gameUserModel_data,
  } = useGameUserModel();
  const genericStyles = useGenericStyles();

  useEffect(() => {
    if (isAppConfigError) {
      onAppError(appConfigErrCode);
    } else if (gameUserModel_isError) {
      onAppError(gameUserModel_appErrCode);
    }
  }, [isAppConfigError, appConfigErrCode, gameUserModel_isError, gameUserModel_appErrCode, onAppError]);

  if (isAppConfigLoading || gameUserModel_isLoading) return (
    <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>
  );

  if (isAppConfigError || gameUserModel_isError) {
    return null;
  }

  const nonJoinedMinimalGameConfigs = getNonJoinedMinimalGameConfigs(
    gamesConfigModel.minimalPublicGameConfigs,
    gameUserModel_data.publicGameUser.joinedGameConfigIds);

  return (
    <View style={genericStyles.spacing}>
      {nonJoinedMinimalGameConfigs.length === 0 &&
        <RnuiText testID="no-available-games-text-tid" variant="titleSmall" >
          {t("games:noGamesAbailable")}
        </RnuiText>
      }

      {nonJoinedMinimalGameConfigs.length > 0 &&
        <RnuiText testID="available-games-text-tid" variant="titleSmall" >
          {t("games:abailableGames")}
        </RnuiText>
      }

      {nonJoinedMinimalGameConfigs.length > 0 &&
        <RnuiMasonryGrid testID="grid-tid" itemFadeInDurationMsOptions={[200, 190, 180, 170, 160, 150]}>
          {nonJoinedMinimalGameConfigs.map((e, index) => (
            <RnuiGridItem testID="grid-item-tid" key={index} xs={12} sm={6} md={4} lg={3} xl={2} >
              <JoinableGameCardView testID="game-card-view-tid" minimalPublicGameConfig={e} />
            </RnuiGridItem>
          ))}
        </RnuiMasonryGrid>
      }
    </View>
  );
};
