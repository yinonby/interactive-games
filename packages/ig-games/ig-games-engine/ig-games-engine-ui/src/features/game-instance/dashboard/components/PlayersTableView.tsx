
import { useAppLocalization, useClientLogger } from '@ig/app-engine-ui';
import { useAuth } from '@ig/auth-ui';
import { comparePlayersForDisplaySort, type GameUserIdT, type PublicPlayerInfoT } from '@ig/games-engine-models';
import { RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../../types/ComponentTypes';
import { PlayerTableRow } from './PlayerTableRow';

export type PlayersTableViewPropsT = TestableComponentT & {
  publicPlayerInfos: PublicPlayerInfoT[],
  withAdminButtons?: boolean,
};

export const PlayersTableView: FC<PlayersTableViewPropsT> = (props) => {
  const { publicPlayerInfos, withAdminButtons } = props;
  const { t } = useAppLocalization();
  const logger = useClientLogger();
  const { curAuthId } = useAuth();
  const curGameUserId = curAuthId as GameUserIdT;

  const curPublicPlayerInfo = publicPlayerInfos.find(e => e.playerId === curGameUserId);
  if (curPublicPlayerInfo === undefined) {
    logger.error(`Unexpected game instance not belonging to player, curGameUserId [${curGameUserId}]`);
    return null;
  }
  const isCurUserAdminPlayer = curPublicPlayerInfo.playerRole === 'admin';
  const otherPublicPlayerInfos = publicPlayerInfos
    .filter(e => e.playerId !== curGameUserId)
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
        publicPlayerInfo={curPublicPlayerInfo}
        withAdminButtons={withAdminButtons}
      />

      {otherPublicPlayerInfos.map((e, index) =>
        <View key={index}>
          <PlayerTableRow
            testID="player-row-tid"
            isCurUserAdminPlayer={isCurUserAdminPlayer}
            isCurUser={false}
            publicPlayerInfo={e}
            withAdminButtons={withAdminButtons}
          />
        </View>
      )}
    </RnuiTable>
  );
};
