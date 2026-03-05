
import type { AuthIdT } from '@ig/auth-models';
import { useStorage } from '@ig/platform-ui';

// local user id utils

const localAuthIdKey = 'gnm::localAuthId';

export const getLocalAuthId = async (): Promise<AuthIdT | null> => {
  const storage = useStorage();
  return await storage.getItem(localAuthIdKey);
}

export const setLocalAuthId = async (accountId: AuthIdT): Promise<void> => {
  const storage = useStorage();
  await storage.setItem(localAuthIdKey, accountId);
}
