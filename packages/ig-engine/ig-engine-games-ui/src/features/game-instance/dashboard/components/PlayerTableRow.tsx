
import { playerRoleToStr, playerStatusToStr, useAppLocalization } from "@ig/engine-app-ui";
import type { PlayerExposedInfoT } from "@ig/engine-models";
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import type { TestableComponentT } from "../../../../types/ComponentTypes";

export type PlayersCardViewPropsT = TestableComponentT & {
  isCurUserAdminPlayer: boolean,
  isCurUser: boolean,
  playerExposedInfo: PlayerExposedInfoT,
  withAdminButtons?: boolean,
};

export const PlayerTableRow: FC<PlayersCardViewPropsT> = (props) => {
  const { isCurUserAdminPlayer, isCurUser, playerExposedInfo, withAdminButtons } = props;
  const { t } = useAppLocalization();
  const youStr = isCurUser ? " (" + t("common:you", { postProcess: 'lowercase' }) + ")" : "";
  const textVariant = isCurUser ? "titleSmall" : undefined;
  const playerRoleStr = t(playerRoleToStr[playerExposedInfo.playerRole]);
  const playerStatusStr = t(playerStatusToStr[playerExposedInfo.playerStatus]);

  let textColor: string | undefined = undefined;
  if (playerExposedInfo.playerStatus === "invited") {
    textColor = "gray";
  } else if (playerExposedInfo.playerStatus === "suspended") {
    textColor = "red";
  }

  return (
    <RnuiTableRow testID="table-row-tid" noHorizontalPadding dense>
      <RnuiTableCell testID="RnuiTableCell-tid">
        <RnuiText variant={textVariant} theme={{ colors: { onSurface: textColor } }}>
          {playerExposedInfo.playerNickname + youStr}
        </RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="RnuiTableCell-tid">
        <RnuiText variant={textVariant} theme={{ colors: { onSurface: textColor } }}>{playerRoleStr}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="RnuiTableCell-tid">
        <RnuiText variant={textVariant} testID="status-text-tid" theme={{ colors: { onSurface: textColor } }}>
          {playerStatusStr}
        </RnuiText>
      </RnuiTableCell>
      {withAdminButtons && isCurUserAdminPlayer && isCurUser &&
        <RnuiTableCell testID="RnuiTableCell-noButtons-tid" endContent><></></RnuiTableCell>
      }
      {withAdminButtons && isCurUserAdminPlayer && !isCurUser &&
        <RnuiTableCell testID="RnuiTableCell-buttons-tid" endContent>
          {playerExposedInfo.playerStatus === "active" &&
            <RnuiButton testID="suspend-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              {t("games:suspend")}
            </RnuiButton>
          }
          {playerExposedInfo.playerStatus === "suspended" &&
            <RnuiButton testID="activate-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              {t("games:activate")}
            </RnuiButton>
          }
          {playerExposedInfo.playerStatus === "invited" &&
            <RnuiButton testID="uninvite-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              {t("games:uninvite")}
            </RnuiButton>
          }
        </RnuiTableCell>
      }
    </RnuiTableRow>
  );
};
