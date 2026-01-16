
import type { MinimalGameConfigT, MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { RnuiActivityIndicator, RnuiGridItem, RnuiMasonryGrid, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppConfigModel } from "../../../app/model/rtk/AppConfigModel";
import { useUserConfigModel } from "../../../domains/user-config/model/rtk/UserConfigModel";
import { MinimalGameCardView } from "./MinimalGameCardView";

export type AvailableGamesViewPropsT = object;

const getNonJoinedMinimalGameConfigs = (
  availableMinimalGameConfigs: MinimalGameConfigT[],
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[],
): MinimalGameConfigT[] => {
  return availableMinimalGameConfigs.filter(e => !minimalGameInstanceExposedInfos
    .find(e2 => e2.minimalGameConfig.gameConfigId === e.gameConfigId));
};

export const AvailableGamesView: FC<AvailableGamesViewPropsT> = () => {
  const { isLoading, isError, data: appConfigModel } = useAppConfigModel();
  const { isLoading: isUserConfigLoading, isError: isUserConfigError, data: userConfigModel } = useUserConfigModel();

  if (isLoading || isUserConfigLoading) return <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>;
  if (isError || isUserConfigError) return <RnuiText>Error</RnuiText>;

  const nonJoinedMinimalGameConfigs = getNonJoinedMinimalGameConfigs(appConfigModel.availableMinimalGameConfigs,
    userConfigModel.minimalGameInstanceExposedInfos);

  return (
    <View >
      {nonJoinedMinimalGameConfigs.length === 0 &&
        <View style={styles.spacingBottom} >
          <RnuiText testID="no-available-games-text-tid" variant="titleSmall" >
            {"No games are available"}
          </RnuiText>
        </View>
      }

      {nonJoinedMinimalGameConfigs.length > 0 &&
        <View style={[styles.spacingBottom]} >
          <RnuiText testID="available-games-text-tid" variant="titleSmall" >
            {"Available games:"}
          </RnuiText>
        </View>
      }

      {nonJoinedMinimalGameConfigs.length > 0 &&
        <RnuiMasonryGrid testID="grid-tid" itemFadeInDurationMsOptions={[200, 190, 180, 170, 160, 150]}>
          {nonJoinedMinimalGameConfigs.map((e, index) => (
            <RnuiGridItem testID="grid-item-tid" key={index} xs={12} sm={6} md={4} lg={3} xl={2} >
              <MinimalGameCardView testID="game-card-view-tid" minimalGameConfig={e} />
            </RnuiGridItem>
          ))}
        </RnuiMasonryGrid>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  spacingBottom: {
    marginBottom: 8,
  },
});
