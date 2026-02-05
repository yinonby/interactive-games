
import { useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import { RnuiActivityIndicator, RnuiCard, RnuiText } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { View } from 'react-native';
import { useGamesUserConfigModel } from '../../../domains/user-config/model/rtk/GamesUserConfigModel';
import { GamesTableView } from './GamesTableView';

export type GamesSummaryViewPropsT = object;

export const GamesSummaryView: FC<GamesSummaryViewPropsT> = () => {
  const { isLoading, isError, appErrCode, data: gamesUserConfigModel } = useGamesUserConfigModel();
  const { t } = useAppLocalization();
  const { onAppError } = useAppErrorHandling();
  const genericStyles = useGenericStyles();

  useEffect(() => {
    if (isError) {
      onAppError(appErrCode);
    }
  }, [isError, onAppError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  const joinedGameConfigs = gamesUserConfigModel.gamesUserConfig.joinedGameConfigs;

  return (
    <View style={genericStyles.spacing}>
      {joinedGameConfigs.length === 0 &&
        <RnuiText variant="titleSmall">{t("games:userNoGamesAbailable")}</RnuiText>
      }

      {joinedGameConfigs.length > 0 &&
        <RnuiCard testID="current-games-card-tid">
          <View style={genericStyles.spacing}>
            <View style={genericStyles.alignTextToTableCell}>
              <RnuiText variant="titleSmall">{t("games:yourGames")}</RnuiText>
            </View>

            <GamesTableView
              testID="current-games-table-view-tid"
              joinedGameConfigs={joinedGameConfigs}
            />
          </View>
        </RnuiCard>
      }
    </View>
  );
};
