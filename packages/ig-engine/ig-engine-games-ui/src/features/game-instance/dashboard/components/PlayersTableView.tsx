
import { useAppConfig, useAppLocalization, useClientLogger } from "@ig/engine-app-ui";
import { comparePlayersForDisplaySort, type PlayerExposedInfoT } from "@ig/engine-models";
import { RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../../types/ComponentTypes';
import { PlayerTableRow } from "./PlayerTableRow";

export type PlayersTableViewPropsT = TestableComponentT & {
  playerExposedInfos: [PlayerExposedInfoT, ...PlayerExposedInfoT[]],
  withAdminButtons?: boolean,
};

export const PlayersTableView: FC<PlayersTableViewPropsT> = (props) => {
  const { playerExposedInfos, withAdminButtons } = props;
  const { t } = useAppLocalization();
  const logger = useClientLogger();
  const { curUserId } = useAppConfig();

  const curPlayerExposedInfo = playerExposedInfos.find(e => e.playerUserId === curUserId);
  if (curPlayerExposedInfo === undefined) {
    logger.error(`Unexpected game instance not belonging to player, curUserId [${curUserId}]`);
    return null;
  }
  const isCurUserAdminPlayer = curPlayerExposedInfo.playerRole === 'admin';
  const otherPlayerExposedInfos = playerExposedInfos
    .filter(e => e.playerUserId !== curUserId)
    .sort(comparePlayersForDisplaySort);

  return (
    <RnuiTable testID="table-tid">
      <RnuiTableHeader testID="table-header-tid" noHorizontalPadding>
        <RnuiTableTitle testID="table-title-tid" dense>
          <RnuiText>{t("common:nickname")}</RnuiText>
        </RnuiTableTitle >
        <RnuiTableTitle testID="table-title-tid" dense>
          <RnuiText>{t("common:role")}</RnuiText>
        </RnuiTableTitle>
        <RnuiTableTitle testID="table-title-tid" dense>
          <RnuiText>{t("common:status")}</RnuiText>
        </RnuiTableTitle>
        {withAdminButtons && isCurUserAdminPlayer &&
          <RnuiTableTitle testID="table-title-tid" dense endContent><></></RnuiTableTitle>
        }
      </RnuiTableHeader>

      <PlayerTableRow
        testID="player-row-tid"
        isCurUserAdminPlayer={isCurUserAdminPlayer}
        isCurUser={true}
        playerExposedInfo={curPlayerExposedInfo}
        withAdminButtons={withAdminButtons}
      />

      {otherPlayerExposedInfos.map((e, index) =>
        <View key={index}>
          <PlayerTableRow
            testID="player-row-tid"
            isCurUserAdminPlayer={isCurUserAdminPlayer}
            isCurUser={false}
            playerExposedInfo={e}
            withAdminButtons={withAdminButtons}
          />
        </View>
      )}
    </RnuiTable>
  );
};
