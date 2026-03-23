
import { DAYS_TO_MS, getEnvVarInt, getEnvVarStr } from '@ig/utils';

export type ApiEnvVarsT = {
  sysDomain: string,
  apiListenPort: number,
  webCorsOrigin: string,
  authEnvVars: {
    jwtSecret: string,
    jwtAlgorithm: string,
    jwtExpiryMs: number,
  },
  mongoDb: {
    listenPort: number,
  },
  redis: {
    listenPort: number,
    redisChatUpdateNotificationChannelName: string,
    redisMsgKindFieldName: string,
    redisGameInstanceUpdateMsgKind: string,
    redisChatUpdateMsgKind: string,
    redisGameInstanceIdFieldName: string,
    redisConversationIdFieldName: string,
  },
}

export const getApiEnvVars = (): ApiEnvVarsT => {
  const sysDomain = getEnvVarStr('IG_ENV__SYS__DOMAIN');
  const apiListenPort = getEnvVarInt('IG_ENV__API__LISTEN_PORT');
  const webCorsOrigin = getEnvVarStr('IG_ENV__WEB__CORS_ORIGIN');
  const jwtSecret = getEnvVarStr('IG_ENV__AUTH__JWT_SECRET');
  const jwtAlgorithm = getEnvVarStr('IG_ENV__AUTH__JWT_ALGORITHM');
  const jwtExpiresInDays = getEnvVarInt('IG_ENV__AUTH__JWT_EXPIRY_DAYS');
  const mongoDbListenPort = getEnvVarInt('IG_ENV__MONGODB__LISTERN_PORT');
  const redisListenPort = getEnvVarInt('IG_ENV__REDIS__LISTEN_PORT');
  const redisChatUpdateNotificationChannelName = getEnvVarStr('IG_ENV__REDIS__CHAT_UPDATE_NOTIFICATION_CHANNEL_NAME');
  const redisMsgKindFieldName = getEnvVarStr('IG_ENV__REDIS__MSG_KIND_FIELD_NAME');
  const redisGameInstanceUpdateMsgKind = getEnvVarStr('IG_ENV__REDIS__GAME_INSTANCE_UPDATE_MSG_KIND');
  const redisChatUpdateMsgKind = getEnvVarStr('IG_ENV__REDIS__CHAT_UPDATE_MSG_KIND');
  const redisGameInstanceIdFieldName = getEnvVarStr('IG_ENV__REDIS__GAME_INSTANCE_ID_FIELD_NAME');
  const redisConversationIdFieldName = getEnvVarStr('IG_ENV__REDIS__CONVERSATION_ID_FIELD_NAME');

  return {
    sysDomain: sysDomain,
    apiListenPort: apiListenPort,
    webCorsOrigin: webCorsOrigin,
    authEnvVars: {
      jwtSecret: jwtSecret,
      jwtAlgorithm: jwtAlgorithm,
      jwtExpiryMs: DAYS_TO_MS(jwtExpiresInDays),
    },
    mongoDb: {
      listenPort: mongoDbListenPort,
    },
    redis: {
      listenPort: redisListenPort,
      redisChatUpdateNotificationChannelName,
      redisMsgKindFieldName,
      redisGameInstanceUpdateMsgKind,
      redisChatUpdateMsgKind,
      redisGameInstanceIdFieldName,
      redisConversationIdFieldName,
    },
  }
}

type DevHttpProxyEnvVarsT = {
    devHttpProxyListenPort: number,
    sysDomain: string,
    webListenPort: number,
    apiListenPort: number,
    wssListenPort: number,
}

export const getDevHttpProxyEnvVars = (): DevHttpProxyEnvVarsT => {
  const devHttpProxyListenPort = getEnvVarInt('IG_ENV__PRX__LISTEN_PORT');
  const sysDomain = getEnvVarStr('IG_ENV__SYS__DOMAIN');
  const webListenPort = getEnvVarInt('IG_ENV__WEB__LISTEN_PORT');
  const apiListenPort = getEnvVarInt('IG_ENV__API__LISTEN_PORT');
  const wssListenPort = getEnvVarInt('IG_ENV__WSS__LISTEN_PORT');

  return {
    devHttpProxyListenPort: devHttpProxyListenPort,
    sysDomain: sysDomain,
    webListenPort: webListenPort,
    apiListenPort: apiListenPort,
    wssListenPort: wssListenPort,
  }
}
