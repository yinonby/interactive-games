
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import { RnuiCard, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { useGameUserModel } from '../../../domains/game-user/model/rtk/GameUserModel';
import { ModelLoadingView } from '../../../features/common/ModelLoadingView';
import { GamesTableView } from './GamesTableView';

export type GamesSummaryViewPropsT = object;

export const GamesSummaryView: FC<GamesSummaryViewPropsT> = () => {
  const { isLoading, isError, appErrCode, data: gameUserModel } = useGameUserModel();
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();

  if (isLoading || isError) {
    return (
      <ModelLoadingView
        testID='ModelLoadingView-tid'
        isLoading={isLoading}
        appErrCode={isError ? appErrCode : null}
      />
    );
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
