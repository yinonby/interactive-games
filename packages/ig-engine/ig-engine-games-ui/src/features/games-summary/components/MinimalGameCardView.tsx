
import { useAppConfig, useAppLocalization } from "@ig/engine-app-ui";
import type { GameInstanceIdT, MinimalGameConfigT } from "@ig/engine-models";
import { usePlatformUiNavigation } from "@ig/platform-ui";
import { RnuiButton, RnuiCard, RnuiText, type RnuiImagePropsT } from "@ig/rnui";
import React, { type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserConfigController } from "../../../domains/user-config/controller/user-actions/UserConfigController";
import { getMinimalGameConfigImageProps } from "../../../utils/GameViewUtils";
import { PriceView } from "./PriceView";

export type MinimalGameCardViewPropsT = {
  minimalGameConfig: MinimalGameConfigT,
  testID?: string;
};

export const MinimalGameCardView: FC<MinimalGameCardViewPropsT> = ({ minimalGameConfig }) => {
  const { imagesSourceMap } = useAppConfig();
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { t } = useAppLocalization();
  const { onPlayGame } = useUserConfigController();
  const { navigate } = usePlatformUiNavigation();
  const rnuiImageProps: RnuiImagePropsT | undefined = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

  const handlePlayGamePress = async (): Promise<void> => {
    const gameInstanceId: GameInstanceIdT | null = await onPlayGame(minimalGameConfig.gameConfigId);
    if (gameInstanceId !== null) {
      const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
      navigate(url);
    }
  }

  return (
    <RnuiCard
      testID="game-card-view-tid"
      imageProps={rnuiImageProps}
    >
      <View style={styles.spacingBottom} >
        <RnuiText variant="titleSmall" >
          {minimalGameConfig.gameName}
        </RnuiText>
      </View>

      <View style={styles.spacingBottom} >
        <RnuiText >
          {t("common:duration") + ": " + t("common:minutes", { minutes: minimalGameConfig.maxDurationMinutes })}
        </RnuiText>
      </View>

      <View style={styles.spacingBottom} >
        <RnuiText >
          {t("games:maxParticipants") + ": " + minimalGameConfig.maxParticipants}
        </RnuiText>
      </View>

      <View style={styles.spacingBottom} >
        <View style={{ flexDirection: "row"}}>
          <RnuiText >{t("common:price") + ": "}</RnuiText>
          <PriceView testID="price-view-tid" price={minimalGameConfig.gamePrice}/>
        </View>
      </View>

      <View style={styles.spacingBottom} >
        <View style={{ flexDirection: "row" }}>
          <RnuiButton testID="play-game-btn-tid" size="xs" mode="outlined" onPress={handlePlayGamePress}>
            {t("games:play")}
          </RnuiButton>
        </View>
      </View>
    </RnuiCard>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  spacingBottom: {
    marginBottom: 8,
  },
  alignTextToTableCell: {
    paddingStart: 16,
  }
});
