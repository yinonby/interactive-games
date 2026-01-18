
import { useGameTheme, useImageAssetDefs } from "@/src/utils/AssetDefs";
import { useGameRnuiStyles, useGameUiConfig, useGameUiUrlPathsAdapter } from "@/src/utils/GameUiConfig";
import { getI18nResources } from "@/src/utils/TranslationsAssetDefs";
import { GameLayout, initI18n } from "@ig/engine-ui";
import { Stack } from "expo-router";

// init i18n must be made once, before any rendering, because i18n is a singleton
const resources = getI18nResources();
initI18n(resources);

export default function RootLayout() {
  return (
    <GameLayout
      imagesSourceMap={useImageAssetDefs()}
      theme={useGameTheme()}
      rnuiStyles={useGameRnuiStyles()}
      gameUiConfig={useGameUiConfig()}
      gameUiUrlPathsAdapter={useGameUiUrlPathsAdapter()}
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Game & More' }} />
        <Stack.Screen name="app/games/index" options={{ title: 'Game & More / Games' }} />
        <Stack.Screen name="app/games/dashboard" options={{ title: 'Game & More / Games Dashboard' }} />
        <Stack.Screen name="app/games/accept-invite/[invitationCode]" options={{ title: 'Game & More / Accept Invitation' }} />
        <Stack.Screen name="app/games/[gameInstanceId]/dashboard" options={{ title: 'Game & More / Game' }} />
      </Stack>
    </GameLayout>
  )
}
