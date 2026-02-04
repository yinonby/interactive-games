
import type { UserIdT } from '@ig/app-engine-models';
import { useStorage } from '@ig/platform-ui';

// local user id utils

const localUserIdKey = 'gnm::localUserId';

export const getLocalUserId = async (): Promise<UserIdT | null> => {
  const storage = useStorage();
  return await storage.getItem(localUserIdKey);
}

export const setLocalUserId = async (userId: UserIdT): Promise<void> => {
  const storage = useStorage();
  await storage.setItem(localUserIdKey, userId);
}
