
import { useAppLocalization, useGenericStyles } from "@ig/engine-ui";
import type { GameInstanceExposedInfoT } from '@ig/games-models';
import { RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from "../../../../types/ComponentTypes";
import { PlayersTableView } from "./PlayersTableView";

export type PlayersViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  withAdminButtons?: boolean,
};

export const PlayersView: FC<PlayersViewPropsT> = (props) => {
  const { gameInstanceExposedInfo, withAdminButtons } = props;
  const { t } = useAppLocalization();
  const { playerExposedInfos } = gameInstanceExposedInfo;
  const genericStyles = useGenericStyles();

  return (
    <View testID="container-tid" style={genericStyles.verticalSpacing}>
      <RnuiText testID="players-text-tid" variant="titleMedium">{t("games:players")}</RnuiText>

      <PlayersTableView
        testID="players-table-view-tid"
        playerExposedInfos={playerExposedInfos}
        withAdminButtons={withAdminButtons}
      />
    </View>
  );
};
