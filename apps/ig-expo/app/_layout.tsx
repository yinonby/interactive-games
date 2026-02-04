
import { useGameTheme, useImageAssetDefs } from '@/src/utils/AssetDefs';
import { useGameRnuiStyles, useGameUiConfig, useGamesUiUrlPathsAdapter } from '@/src/utils/GameUiConfig';
import { getI18nResources } from '@/src/utils/TranslationsAssetDefs';
import { AppRootLayout, initI18n, useAppErrorHandling, useClientLogger } from '@ig/app-engine-ui';
import { AuthProvider } from '@ig/auth-ui';
import { handleGamesWebSocketMessage } from '@ig/games-engine-ui';
import { Stack } from 'expo-router';

// init i18n must be made once, before any rendering, because i18n is a singleton
const resources = getI18nResources();
initI18n(resources);

export default function RootLayout() {
  return (
    <AppRootLayout
      imagesSourceMap={useImageAssetDefs()}
      theme={useGameTheme()}
      rnuiStyles={useGameRnuiStyles()}
      gameUiConfig={useGameUiConfig()}
      gamesUiUrlPathsAdapter={useGamesUiUrlPathsAdapter()}
      appWebSocketMsgHandlers={[handleGamesWebSocketMessage]}
    >
      <InnerLayout/>
    </AppRootLayout>
  )
}

// AuthProvider depends on AppRootLayout for:
// - redux
// - useClientLogger
// - useAppErrorHandling
function InnerLayout() {
  const logger = useClientLogger();
  const { onUnknownError } = useAppErrorHandling();

  return (
    <AuthProvider
      logger={logger}
      onUnknownError={onUnknownError}
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Game & More' }} />
        <Stack.Screen name="app/games/index" options={{ title: 'Game & More / Games' }} />
        <Stack.Screen name="app/games/dashboard" options={{ title: 'Game & More / All Games' }} />
        <Stack.Screen name="app/games/accept-invite/[invitationCode]" options={{ title: 'Game & More / Accept Invitation' }} />
        <Stack.Screen name="app/games/[gameConfigId]/dashboard" options={{ title: 'Game & More / Your Games' }} />
        <Stack.Screen name="app/games/instance/[gameInstanceId]/dashboard" options={{ title: 'Game & More / Game Dashboard' }} />
      </Stack>
    </AuthProvider>
  )
}
