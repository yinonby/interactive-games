
import { useStorage } from '../../../../../ig-lib/ig-client-lib/ig-platform-ui';
import type { UserIdT } from '../../../../ig-app-engine-models';

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
