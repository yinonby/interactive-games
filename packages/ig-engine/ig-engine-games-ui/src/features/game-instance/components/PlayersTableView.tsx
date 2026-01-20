
import { useAppConfig, useAppLocalization, useClientLogger } from "@ig/engine-app-ui";
import { comparePlayersForDisplaySort, type PlayerExposedInfoT } from "@ig/engine-models";
import { RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import { PlayerTableRow } from "./PlayerTableRow";

export type PlayersTableViewPropsT = {
  playerExposedInfos: [PlayerExposedInfoT, ...PlayerExposedInfoT[]],
  testID?: string;
};

export const PlayersTableView: FC<PlayersTableViewPropsT> = ({ playerExposedInfos }) => {
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
      <RnuiTableHeader testID="table-header-tid" style={{ paddingHorizontal: 0 }}>
        <RnuiTableTitle testID="table-title-tid">
          <RnuiText>{t("common:nickname")}</RnuiText>
        </RnuiTableTitle >
        <RnuiTableTitle testID="table-title-tid">
          <RnuiText>{t("common:role")}</RnuiText>
        </RnuiTableTitle>
        <RnuiTableTitle testID="table-title-tid">
          <RnuiText>{t("common:status")}</RnuiText>
        </RnuiTableTitle>
        {isCurUserAdminPlayer &&
          <RnuiTableTitle testID="table-title-tid" endContent><></></RnuiTableTitle>
        }
      </RnuiTableHeader>

      <PlayerTableRow
        testID="player-row-tid"
        isCurUserAdminPlayer={isCurUserAdminPlayer}
        isCurUser={true}
        playerExposedInfo={curPlayerExposedInfo}
      />

      {otherPlayerExposedInfos.map((e, index) =>
        <View key={index}>
          <PlayerTableRow
            testID="player-row-tid"
            isCurUserAdminPlayer={isCurUserAdminPlayer}
            isCurUser={false}
            playerExposedInfo={e}
          />
        </View>
      )}
    </RnuiTable>
  );
};
