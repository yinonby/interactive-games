
import { useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { MinimalGameInfoT } from '@ig/games-engine-models';
import { RnuiActivityIndicator, RnuiGridItem, RnuiMasonryGrid, RnuiText } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { View } from 'react-native';
import { useGamesAppModel } from '../../../domains/games-app/model/rtk/GamesAppModel';
import { useGamesUserConfigModel } from '../../../domains/user-config/model/rtk/GamesUserConfigModel';
import { JoinableGameCardView } from './JoinableGameCardView';

const getNonJoinedMinimalGameConfigs = (
  availableMinimalGameInfos: MinimalGameInfoT[],
  joinedGameInfos: MinimalGameInfoT[],
): MinimalGameInfoT[] => {
  return availableMinimalGameInfos.filter(e => !joinedGameInfos
    .find(e2 => e2.gameConfigId === e.gameConfigId));
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
    isLoading: isUserConfigLoading,
    isError: isUserConfigError,
    appErrCode: userConfigErrCode,
    data: gamesUserConfigModel,
  } = useGamesUserConfigModel();
  const genericStyles = useGenericStyles();

  useEffect(() => {
    if (isAppConfigError) {
      onAppError(appConfigErrCode);
    } else if (isUserConfigError) {
      onAppError(userConfigErrCode);
    }
  }, [isAppConfigError, appConfigErrCode, isUserConfigError, userConfigErrCode, onAppError]);

  if (isAppConfigLoading || isUserConfigLoading) return (
    <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>
  );

  if (isAppConfigError || isUserConfigError) {
    return null;
  }

  const nonJoinedMinimalGameConfigs = getNonJoinedMinimalGameConfigs(
    gamesConfigModel.minimalGameInfos,
    gamesUserConfigModel.gamesUserConfig.joinedGameInfos);

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
              <JoinableGameCardView testID="game-card-view-tid" minimalGameInfo={e} />
            </RnuiGridItem>
          ))}
        </RnuiMasonryGrid>
      }
    </View>
  );
};
