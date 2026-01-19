
import { useAppLocalization } from "@ig/engine-app-ui";
import { RnuiButton, RnuiTextInput } from "@ig/rnui";
import { useState, type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserConfigController } from "../../../domains/user-config/controller/user-actions/UserConfigController";

export type AddGameViewPropsT = object;

export const AddGameView: FC<AddGameViewPropsT> = () => {
  const [gameCode, setGameCode] = useState<string>("");
  const { onAddGame } = useUserConfigController();
  const { t } = useAppLocalization();

  const handlePress = (): void => {
    if (gameCode !== "") {
      onAddGame(gameCode);
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
          value={gameCode}
          onChangeText={setGameCode}
        />
      </View>
      <RnuiButton testID="add-game-button" onPress={handlePress} disabled={gameCode === ""}>
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
