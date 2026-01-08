
import { RnuiCard, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserConfigModel } from "../../../domains/user-config/model/rtk/UserConfigModel";
import { GamesTableView } from "./GamesTableView";

export type GamesSummaryViewPropsT = object;

export const GamesSummaryView: FC<GamesSummaryViewPropsT> = () => {
  const { isLoading, isError, data: userConfigModel } = useUserConfigModel();

  if (isLoading) return <RnuiText>Loading</RnuiText>;
  if (isError) return <RnuiText>Error</RnuiText>;
  const minimalGameInstanceExposedInfos = userConfigModel.minimalGameInstanceExposedInfos;

  return (
    <View >
      {minimalGameInstanceExposedInfos.length === 0 &&
        <View style={styles.spacingBottom} >
          <RnuiText variant="titleSmall" >
            {"You don't have any games at the moment"}
          </RnuiText>
        </View>
      }

      {minimalGameInstanceExposedInfos.length > 0 &&
        <View style={[styles.spacingBottom]} >
          <RnuiText variant="titleSmall" >
            {"Your games:"}
          </RnuiText>
        </View>
      }

      {minimalGameInstanceExposedInfos.length > 0 &&
        <RnuiCard testID="current-games-card-tid" >
          <GamesTableView testID="current-games-table-view-tid" minimalGameInstanceExposedInfos={minimalGameInstanceExposedInfos} />
        </RnuiCard>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  spacingBottom: {
    marginBottom: 8,
  },
});
