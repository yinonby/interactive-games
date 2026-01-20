
import { __puiMocks } from '@ig/platform-ui';
import { getLocalUserId, setLocalUserId } from './AppConfigUtils';

const localUserIdKey = 'gnm::localUserId';

describe('AppConfigUtils', () => {
  const { getItemMock, setItemMock } = __puiMocks;
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getLocalUserId returns stored user id', async () => {
    getItemMock.mockResolvedValue('user-123');

    const result = await getLocalUserId();

    expect(getItemMock).toHaveBeenCalledWith(localUserIdKey);
    expect(result).toBe('user-123');
  });

  it('getLocalUserId returns null when no id is stored', async () => {
    getItemMock.mockResolvedValue(null);

    const result = await getLocalUserId();

    expect(getItemMock).toHaveBeenCalledWith(localUserIdKey);
    expect(result).toBeNull();
  });

  it('setLocalUserId stores the provided user id', async () => {
    setItemMock.mockResolvedValue(undefined);

    await setLocalUserId('user-456');

    expect(setItemMock).toHaveBeenCalledWith(localUserIdKey, 'user-456');
  });
});