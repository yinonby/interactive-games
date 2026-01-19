
import { useAppLocalization } from "@ig/engine-app-ui";
import type { PlayerExposedInfoT } from "@ig/engine-models";
import { RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import { PlayerTableRow } from "./PlayerTableRow";

export type PlayersTableViewPropsT = {
  isPlayerAdmin: boolean,
  otherPlayerExposedInfos: PlayerExposedInfoT[],
  testID?: string;
};

export const PlayersTableView: FC<PlayersTableViewPropsT> = ({ isPlayerAdmin, otherPlayerExposedInfos }) => {
  const { t } = useAppLocalization();

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
        {isPlayerAdmin &&
          <RnuiTableTitle testID="table-title-tid" endContent><></></RnuiTableTitle>
        }
      </RnuiTableHeader>
      {otherPlayerExposedInfos.map((e, index) =>
        <View key={index}>
          <PlayerTableRow testID="player-row-tid" isPlayerAdmin={isPlayerAdmin} otherPlayerExposedInfo={e} />
        </View>
      )}
    </RnuiTable>
  );
};
