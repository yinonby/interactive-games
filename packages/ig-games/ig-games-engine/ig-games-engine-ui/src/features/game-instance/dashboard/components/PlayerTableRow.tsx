
import { useAppLocalization } from '@ig/app-engine-ui';
import { type PublicPlayerInfoT } from '@ig/games-engine-models';
import { playerRoleToTranslationKey, playerStatusToTranslationKey } from '@ig/games-engine-ui-models';
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../../types/ComponentTypes';

export type PlayersCardViewPropsT = TestableComponentT & {
  isCurUserAdminPlayer: boolean,
  isCurUser: boolean,
  publicPlayerInfo: PublicPlayerInfoT,
  withAdminButtons?: boolean,
};

export const PlayerTableRow: FC<PlayersCardViewPropsT> = (props) => {
  const { isCurUserAdminPlayer, isCurUser, publicPlayerInfo, withAdminButtons } = props;
  const { t } = useAppLocalization();
  const youStr = isCurUser ? " (" + t("common:you", { postProcess: 'lowercase' }) + ")" : "";
  const textVariant = isCurUser ? "titleSmall" : undefined;
  const playerRoleStr = t(playerRoleToTranslationKey[publicPlayerInfo.playerRole]);
  const playerStatusStr = t(playerStatusToTranslationKey[publicPlayerInfo.playerStatus]);

  let textColor: string | undefined = undefined;
  if (publicPlayerInfo.playerStatus === "invited") {
    textColor = "gray";
  } else if (publicPlayerInfo.playerStatus === "suspended") {
    textColor = "red";
  }

  return (
    <RnuiTableRow testID="table-row-tid" noHorizontalPadding dense={!withAdminButtons}>
      <RnuiTableCell testID="RnuiTableCell-tid">
        <RnuiText variant={textVariant} theme={{ colors: { onSurface: textColor } }}>
          {publicPlayerInfo.playerNickname + youStr}
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
        <RnuiTableCell testID="RnuiTableCell-buttons-tid" endContent >
          {publicPlayerInfo.playerStatus === "active" &&
            <RnuiButton testID="suspend-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              {t("games:suspend")}
            </RnuiButton>
          }
          {publicPlayerInfo.playerStatus === "suspended" &&
            <RnuiButton testID="activate-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              {t("games:activate")}
            </RnuiButton>
          }
          {publicPlayerInfo.playerStatus === "invited" &&
            <RnuiButton testID="uninvite-btn-tid" mode="contained-tonal" size="xs" onPress={() => { }}>
              {t("games:uninvite")}
            </RnuiButton>
          }
        </RnuiTableCell>
      }
    </RnuiTableRow>
  );
};
