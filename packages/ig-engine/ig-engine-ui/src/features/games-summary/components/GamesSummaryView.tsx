
import { RnuiActivityIndicator, RnuiCard, RnuiText } from "@ig/rnui";
import React, { useEffect, type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppErrorHandling } from "../../../app/error-handling/AppErrorHandlingProvider";
import { useAppLocalization } from "../../../app/localization/AppLocalizationProvider";
import { useUserConfigModel } from "../../../domains/user-config/model/rtk/UserConfigModel";
import { GamesTableView } from "./GamesTableView";

export type GamesSummaryViewPropsT = object;

export const GamesSummaryView: FC<GamesSummaryViewPropsT> = () => {
  const { isLoading, isError, appErrCode, data: userConfigModel } = useUserConfigModel();
  const { t } = useAppLocalization();
  const { onError } = useAppErrorHandling();

  useEffect(() => {
    if (isError) {
      onError(appErrCode);
    }
  }, [isError, onError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  const minimalGameInstanceExposedInfos = userConfigModel.minimalGameInstanceExposedInfos;

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
