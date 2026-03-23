
// keep this with no imports, expo has issue with ESM modules

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

export const getExpoEnvVars = (): ExpoEnvVarsT => {
  const webBaseUrl = getEnvVarStr('IG_ENV__WEB__BASE_URL');
  const apiBaseUrl = getEnvVarStr('IG_ENV__API__BASE_URL');
  const wssBaseUrl = getEnvVarStr('IG_ENV__WSS__BASE_URL');
  const gameInstanceUpdateNotificationTopicPrefix = getEnvVarStr('IG_ENV__WS__GAME_INSTANCE_TOPIC_PREFIX');
  const gameInstanceUpdateNotificationName = getEnvVarStr('IG_ENV__WS__GAME_INSTANCE_UPDATE_NOTIFICATION_KIND');
  const gameInstanceIdFieldName = getEnvVarStr('IG_ENV__WS__GAME_INSTANCE_ID_FIELD_NAME');
  const chatUpdateNotificationTopicPrefix = getEnvVarStr('IG_ENV__WS__CONVERSATION_TOPIC_PREFIX');
  const chatUpdateNotificationName = getEnvVarStr('IG_ENV__WS__CHAT_UPDATE_NOTIFICATION_KIND');
  const conversationIdFieldName = getEnvVarStr('IG_ENV__WS__CONVERSATION_ID_FIELD_NAME');

  return {
    webBaseUrl,
    apiBaseUrl,
    wssBaseUrl,
    websocketConfig: {
      gameInstanceUpdateNotificationConfig: {
        gameInstanceUpdateNotificationTopicPrefix,
        gameInstanceUpdateNotificationName,
        gameInstanceIdFieldName,
      },
      chatUpdateNotificationConfig: {
        chatUpdateNotificationTopicPrefix,
        chatUpdateNotificationName,
        conversationIdFieldName,
      },
    },
  }
}

export function getEnvVarStr(envVarName: string): string {
  const envVar: string | undefined = process.env[envVarName];
  if (!envVar) {
    throw new Error("Missing env var: " + envVarName);
  }
  return envVar;
}
