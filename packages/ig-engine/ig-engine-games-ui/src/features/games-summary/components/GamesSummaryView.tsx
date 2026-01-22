
import { useAppErrorHandling, useAppLocalization } from "@ig/engine-app-ui";
import { RnuiActivityIndicator, RnuiCard, RnuiText } from "@ig/rnui";
import React, { useEffect, type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGamesUserConfigModel } from "../../../domains/user-config/model/rtk/GamesUserConfigModel";
import { GamesTableView } from "./GamesTableView";

export type GamesSummaryViewPropsT = object;

export const GamesSummaryView: FC<GamesSummaryViewPropsT> = () => {
  const { isLoading, isError, appErrCode, data: gamesUserConfigModel } = useGamesUserConfigModel();
  const { t } = useAppLocalization();
  const { onAppError } = useAppErrorHandling();

  useEffect(() => {
    if (isError) {
      onAppError(appErrCode);
    }
  }, [isError, onAppError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  const minimalGameInstanceExposedInfos = gamesUserConfigModel.gamesUserConfig.minimalGameInstanceExposedInfos;

  return (
    <View >
      {minimalGameInstanceExposedInfos.length === 0 &&
        <View style={styles.spacingBottom} >
          <RnuiText variant="titleSmall">{t("games:userNoGamesAbailable")}</RnuiText>
        </View>
      }

      {minimalGameInstanceExposedInfos.length > 0 &&
        <View style={[styles.spacingBottom]} >
          <RnuiText variant="titleSmall">{t("games:yourGames")}</RnuiText>
        </View>
      }

      {minimalGameInstanceExposedInfos.length > 0 &&
        <RnuiCard testID="current-games-card-tid" >
          <GamesTableView
            testID="current-games-table-view-tid"
            minimalGameInstanceExposedInfos={minimalGameInstanceExposedInfos}
          />
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
