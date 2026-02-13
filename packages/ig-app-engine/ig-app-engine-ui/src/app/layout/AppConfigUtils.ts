
import type { AccountIdT } from '@ig/app-engine-models';
import { useStorage } from '@ig/platform-ui';

// local user id utils

const localAccountIdKey = 'gnm::localAccountId';

export const getLocalAccountId = async (): Promise<AccountIdT | null> => {
  const storage = useStorage();
  return await storage.getItem(localAccountIdKey);
}
