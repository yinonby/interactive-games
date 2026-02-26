
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { PublicGameConfigT } from '@ig/games-engine-models';
import { RnuiTable, RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import { MS_TO_MIN } from '@ig/utils';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { MinimalPublicGameConfigTableRows } from './MinimalPublicGameConfigTableRows';

export type PublicGameConfigSummaryViewPropsT = TestableComponentT & {
  publicGameConfig: PublicGameConfigT,
};

export const PublicGameConfigSummaryView: FC<PublicGameConfigSummaryViewPropsT> = ({ publicGameConfig }) => {
  const { t } = useAppLocalization();
  const genericStyles = useGenericStyles();
  const extraTimeLimitMinutesStr = publicGameConfig.extraTimeLimitDurationInfo.kind === 'unlimited' ?
    t("common:unlimited") :
    t("common:minutes", { minutes: MS_TO_MIN(publicGameConfig.extraTimeLimitDurationInfo.durationMs) });

  return (
    <View style={genericStyles.spacing}>
      <RnuiText variant="titleSmall" >
        {publicGameConfig.gameName}
      </RnuiText>

      <RnuiTable>
        <MinimalPublicGameConfigTableRows testID='MinimalPublicGameConfigTableRows-tid' minimalPublicGameConfig={publicGameConfig} />

        <RnuiTableRow noHorizontalPadding dense>
          <RnuiTableCell>
            <RnuiText >
              {t("games:extraTimeLimit")}
            </RnuiText>
          </RnuiTableCell>
          <RnuiTableCell>
            <RnuiText >
              {extraTimeLimitMinutesStr}
            </RnuiText>
          </RnuiTableCell>
        </RnuiTableRow>
      </RnuiTable>
    </View>
  );
};
