
import type { PlayerExposedInfoT } from "@ig/engine-models";
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { useAppLocalization } from "../../../app/localization/AppLocalizationProvider";
import type { TestableComponentT } from "../../../types/ComponentTypes";

export type PlayersCardViewPropsT = TestableComponentT & {
  isPlayerAdmin: boolean,
  otherPlayerExposedInfo: PlayerExposedInfoT,
};

export const PlayerTableRow: FC<PlayersCardViewPropsT> = ({ isPlayerAdmin, otherPlayerExposedInfo }) => {
    const { t } = useAppLocalization();

  let statusOnSurfaceColor: string | undefined = undefined;
  if (otherPlayerExposedInfo.playerStatus === "playing") {
    statusOnSurfaceColor = "green";
  } else if (otherPlayerExposedInfo.playerStatus === "suspended") {
    statusOnSurfaceColor = "red";
  }

  return (
    <RnuiTableRow testID="table-row-tid" style={{ paddingHorizontal: 0 }}>
      <RnuiTableCell testID="table-cell-tid">
        <RnuiText>{otherPlayerExposedInfo.playerNickname}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="table-cell-tid">
        <RnuiText>{otherPlayerExposedInfo.playerRole}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="table-cell-tid">
        <RnuiText testID="status-text-tid" theme={{ colors: { onSurface: statusOnSurfaceColor } }}>
          {otherPlayerExposedInfo.playerStatus}
        </RnuiText>
      </RnuiTableCell>
      {isPlayerAdmin &&
        <RnuiTableCell testID="table-cell-tid" endContent>
          {otherPlayerExposedInfo.playerStatus === "playing" &&
            <RnuiButton testID="suspend-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              <RnuiText>{t("games:suspend")}</RnuiText>
            </RnuiButton>
          }
          {otherPlayerExposedInfo.playerStatus === "suspended" &&
            <RnuiButton testID="activate-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              <RnuiText>{t("games:activate")}</RnuiText>
            </RnuiButton>
          }
          {otherPlayerExposedInfo.playerStatus === "invited" &&
            <RnuiButton testID="uninvite-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              <RnuiText>{t("games:uninvite")}</RnuiText>
            </RnuiButton>
          }
        </RnuiTableCell>
      }
    </RnuiTableRow>
  );
};
