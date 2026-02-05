
import { useAppConfig, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { GameInstanceExposedInfoT } from '@ig/games-engine-models';
import { RnuiButton, RnuiCopyToClipboard, RnuiQrCode, RnuiText } from '@ig/rnui';
import type React from 'react';
import type { FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../../types/ComponentTypes';

export type InviteViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
};

export const InviteView: FC<InviteViewPropsT> = (props) => {
  const { gameInstanceExposedInfo } = props;
  const { t } = useAppLocalization();
  const { invitationCode, gameConfig, playerExposedInfos } = gameInstanceExposedInfo;
  const { gameUiConfig } = useAppConfig();
  const invitationUrl = gameUiConfig.apiUrl + "/games/accept-invite/" + invitationCode;
  const isSaturated = playerExposedInfos.length >= gameConfig.maxParticipants - 1;
  const genericStyles = useGenericStyles();

  const handlePress = () => {
    // does nothing at the moment
  };

  return (
    <View>
      <View style={[genericStyles.flexRow]}>
        <RnuiText testID="invite-code-title-tid">{t("games:invitationCode") + ":"}</RnuiText>

        <RnuiText testID="invite-code-tid" variant="titleSmall">{invitationCode}</RnuiText>

        <RnuiCopyToClipboard testID="copy-to-clipboard-code-tid" copyText={invitationCode} size="xs" />

        <RnuiCopyToClipboard
          testID="copy-to-clipboard-link-tid"
          copyText={invitationUrl}
          text={t("common:copyLink")}
          size="xs"
        />

        <RnuiButton testID="share-btn-tid" size="xs" onPress={handlePress} disabled={isSaturated}>
          {t("common:share")}
        </RnuiButton>

        <View style={[genericStyles.flex1]} />

        <RnuiQrCode testID="qr-code-tid" data={invitationUrl} pieceCornerType="rounded" size={50} />
      </View>
    </View>
  );
};
