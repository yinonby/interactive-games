
import { useGameTheme, useImageAssetDefs } from '@/src/utils/AssetDefs';
import { useGameRnuiStyles, useGameUiConfig, useGamesUiUrlPathsAdapter } from '@/src/utils/GameUiConfig';
import { getI18nResources } from '@/src/utils/TranslationsAssetDefs';
import { AppRootLayout, initI18n, useAppErrorHandling, useClientLogger } from '@ig/app-engine-ui';
import { AuthProvider } from '@ig/auth-ui';
import { ChatProvider } from '@ig/chat-ui';
import { GamesProvider, createWebsocketMessageHandler, type WebsocketUpdatesConfigT } from '@ig/games-engine-ui';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';

type ExpoEnvVarsT = {
  webBaseUrl: string,
  apiBaseUrl: string,
  wssBaseUrl: string,
  websocketConfig: {
    gameInstanceUpdateNotificationConfig: {
      gameInstanceUpdateNotificationTopicPrefix: string,
      gameInstanceUpdateNotificationName: string,
      gameInstanceIdFieldName: string,
    },
    chatUpdateNotificationConfig: {
      chatUpdateNotificationTopicPrefix: string,
      chatUpdateNotificationName: string,
      conversationIdFieldName: string,
    },
  }
}

// init i18n must be made once, before any rendering, because i18n is a singleton
const resources = getI18nResources();
initI18n(resources);

export default function RootLayout() {
  const expoEnvVars: ExpoEnvVarsT | undefined = Constants.expoConfig?.extra?.env.expoEnvVars;
  if (!expoEnvVars) {
    throw new Error("Missing expoEnvVars");
  }
  const websocketConfig: WebsocketUpdatesConfigT = {
    gameInstanceWebsocketUpdatesConfig: {
      gameInstanceUpdateNotificationName: expoEnvVars.websocketConfig.gameInstanceUpdateNotificationConfig.gameInstanceUpdateNotificationName,
      gameInstanceIdFieldName: expoEnvVars.websocketConfig.gameInstanceUpdateNotificationConfig.gameInstanceIdFieldName,
    },
    chatWebsocketUpdatesConfig: {
      chatUpdateNotificationName: expoEnvVars.websocketConfig.chatUpdateNotificationConfig.chatUpdateNotificationName,
      conversationIdFieldName: expoEnvVars.websocketConfig.chatUpdateNotificationConfig.conversationIdFieldName,
    }
  }
  const appWebSocketMsgHandler = createWebsocketMessageHandler(websocketConfig);

  return (
    <AppRootLayout
      imagesSourceMap={useImageAssetDefs()}
      theme={useGameTheme()}
      rnuiStyles={useGameRnuiStyles()}
      gameUiConfig={useGameUiConfig()}
      gamesUiUrlPathsAdapter={useGamesUiUrlPathsAdapter()}
      appWebSocketMsgHandlers={[appWebSocketMsgHandler]}
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
  const expoEnvVars: ExpoEnvVarsT | undefined = Constants.expoConfig?.extra?.env.expoEnvVars;
  if (!expoEnvVars) {
    throw new Error("Missing expoEnvVars");
  }

  const { websocketConfig } = expoEnvVars;

  return (
    <AuthProvider
      logger={logger}
      onUnknownError={onUnknownError}
    >
      <ChatProvider
        chatUpdateNotificationTopicPrefix={websocketConfig.chatUpdateNotificationConfig.chatUpdateNotificationTopicPrefix}
      > { /* depends on AppRootLayout */}
        <GamesProvider
          gameInstanceUpdateNotificationTopicPrefix={websocketConfig.gameInstanceUpdateNotificationConfig.gameInstanceUpdateNotificationTopicPrefix}
        > { /* depends on AppRootLayout and AuthProvider */}
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Game & More' }} />
            <Stack.Screen name="app/games/index" options={{ title: 'Game & More / Games' }} />
            <Stack.Screen name="app/games/dashboard" options={{ title: 'Game & More / All Games' }} />
            <Stack.Screen name="app/games/accept-invite/[invitationCode]" options={{ title: 'Game & More / Accept Invitation' }} />
            <Stack.Screen name="app/games/[gameConfigId]/dashboard" options={{ title: 'Game & More / Your Games' }} />
            <Stack.Screen name="app/games/instance/[gameInstanceId]/dashboard" options={{ title: 'Game & More / Game Dashboard' }} />
          </Stack>
        </GamesProvider>
      </ChatProvider>
    </AuthProvider>
  )
}
