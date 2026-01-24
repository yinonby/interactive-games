
import { useAppConfig, useAppErrorHandling, useAppLocalization } from "@ig/engine-app-ui";
import type { GameInstanceIdT } from '@ig/games-models';
import { usePlatformUiNavigation } from '@ig/platform-ui';
import { RnuiButton, RnuiTextInput } from "@ig/rnui";
import { useState, type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGamesUserConfigController } from "../../../domains/user-config/controller/user-actions/GamesUserConfigController";

export type AddGameViewPropsT = object;

export const AddGameView: FC<AddGameViewPropsT> = () => {
  const [invitationCode, setInvitationCode] = useState<string>("");
  const { onAcceptInvite } = useGamesUserConfigController();
  const { t } = useAppLocalization();
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { navigate } = usePlatformUiNavigation();
  const { onUnknownError } = useAppErrorHandling();

  const handlePress = async (): Promise<void> => {
    if (invitationCode !== "") {
      try {
        const gameInstanceId: GameInstanceIdT = await onAcceptInvite(invitationCode);

        const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
        navigate(url);
      } catch (e) {
        onUnknownError(e);

        const url = gamesUiUrlPathsAdapter.buildGamesDashboardUrlPath();
        navigate(url);
      }
    }
  }

  return (
    <View
      testID="add-game-view"
      style={styles.container}
    >
      <View style={{ maxWidth: 200, marginEnd: 8 }} >
        <RnuiTextInput
          testID="game-code-input"
          label={t("games:invitationCode")}
          value={invitationCode}
          onChangeText={setInvitationCode}
        />
      </View>
      <RnuiButton testID="add-game-button" onPress={handlePress} disabled={invitationCode === ""}>
        {t("games:joinGame")}
      </RnuiButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "flex-end",
  },
});
