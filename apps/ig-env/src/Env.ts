
import { DAYS_TO_MS, getEnvVarInt, getEnvVarStr } from '@ig/utils';

type ApiEnvVarsT = {
  sysDomain: string,
  apiListenPort: number,
  webCorsOrigin: string,
  authEnvVars: {
    jwtSecret: string,
    jwtAlgorithm: string,
    jwtExpiryMs: number,
  }
}

export const getApiEnvVars = (): ApiEnvVarsT => {
  const sysDomain = getEnvVarStr('IG_ENV__SYS__DOMAIN');
  const apiListenPort = getEnvVarInt('IG_ENV__API__LISTEN_PORT');
  const webCorsOrigin = getEnvVarStr('IG_ENV__WEB__CORS_ORIGIN');
  const jwtSecret = getEnvVarStr('IG_ENV__AUTH__JWT_SECRET');
  const jwtAlgorithm = getEnvVarStr('IG_ENV__AUTH__JWT_ALGORITHM');
  const jwtExpiresInDays = getEnvVarInt('IG_ENV__AUTH__JWT_EXPIRY_DAYS');

  return {
    sysDomain: sysDomain,
    apiListenPort: apiListenPort,
    webCorsOrigin: webCorsOrigin,
    authEnvVars: {
      jwtSecret: jwtSecret,
      jwtAlgorithm: jwtAlgorithm,
      jwtExpiryMs: DAYS_TO_MS(jwtExpiresInDays),
    },
  }
}

type ExpoEnvVarsT = {
  webBaseUrl: string,
  apiBaseUrl: string,
  wssBaseUrl: string,
}

export const getExpoEnvVars = (): ExpoEnvVarsT => {
  const webBaseUrl = getEnvVarStr('IG_ENV__WEB__BASE_URL');
  const apiBaseUrl = getEnvVarStr('IG_ENV__API__BASE_URL');
  const wssBaseUrl = getEnvVarStr('IG_ENV__WSS__BASE_URL');

  return {
    webBaseUrl: webBaseUrl,
    apiBaseUrl: apiBaseUrl,
    wssBaseUrl: wssBaseUrl,
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
