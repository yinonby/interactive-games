
import { useAppLocalization, useGenericStyles } from "@ig/engine-app-ui";
import type { GameInstanceExposedInfoT } from "@ig/engine-models";
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from "../../../types/ComponentTypes";
import { PlayersTableView } from "./PlayersTableView";

export type PlayersViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
};

export const PlayersView: FC<PlayersViewPropsT> = (props) => {
  const { t } = useAppLocalization();
  const { gameInstanceExposedInfo } = props;
  const { playerRole, otherPlayerExposedInfos } = gameInstanceExposedInfo;
  const genericStyles = useGenericStyles();
  const isPlayerAdmin = playerRole === "admin";
  const arePlayersPresent = otherPlayerExposedInfos.length > 0;

  if (!arePlayersPresent) {
    return (
      <View >
        <RnuiText testID="no-players-text-tid" variant="titleSmall">{t("games:noPlayers")}</RnuiText>
      </View>
    );
  } else {
    return (
      <View >
        <View style={genericStyles.spacingBottom} >
          <RnuiText testID="players-text-tid" variant="titleSmall">{t("games:players")}</RnuiText>
        </View>
        <View style={genericStyles.spacingBottom} >
          <PlayersTableView
            testID="players-table-view-tid"
            isPlayerAdmin={isPlayerAdmin}
            otherPlayerExposedInfos={otherPlayerExposedInfos}
          />
        </View>
      </View>
    );
  }
};
