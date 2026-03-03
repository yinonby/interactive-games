
import { useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import { RnuiActivityIndicator, RnuiCard, RnuiText } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { View } from 'react-native';
import { useGameUserModel } from '../../../domains/game-user/model/rtk/GameUserModel';
import { GamesTableView } from './GamesTableView';

export type GamesSummaryViewPropsT = object;

export const GamesSummaryView: FC<GamesSummaryViewPropsT> = () => {
  const { isLoading, isError, appErrCode, data: gameUserModel } = useGameUserModel();
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

  const joinedGameConfigIds = gameUserModel.publicGameUser.joinedGameConfigIds;

  return (
    <View style={genericStyles.spacing}>
      {joinedGameConfigIds.length === 0 &&
        <RnuiText variant="titleSmall">{t("games:userNoGamesAbailable")}</RnuiText>
      }

      {joinedGameConfigIds.length > 0 &&
        <RnuiCard testID="current-games-card-tid">
          <View style={genericStyles.spacing}>
            <View style={genericStyles.alignTextToTableCell}>
              <RnuiText variant="titleSmall">{t("games:yourGames")}</RnuiText>
            </View>

            <GamesTableView
              testID="current-games-table-view-tid"
              joinedGameConfigIds={joinedGameConfigIds}
            />
          </View>
        </RnuiCard>
      }
    </View>
  );
};
