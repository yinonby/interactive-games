
import { __puiMocks } from '@ig/platform-ui';
import { getLocalAccountId, setLocalAccountId } from './AuthUtils';

const localAccountIdKey = 'gnm::localAccountId';

describe('AppConfigUtils', () => {
  const { getItemMock, setItemMock } = __puiMocks;
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getLocalAccountId returns stored user id', async () => {
    getItemMock.mockResolvedValue('user-123');

    const result = await getLocalAccountId();

    expect(getItemMock).toHaveBeenCalledWith(localAccountIdKey);
    expect(result).toBe('user-123');
  });

  it('getLocalAccountId returns null when no id is stored', async () => {
    getItemMock.mockResolvedValue(null);

    const result = await getLocalAccountId();

    expect(getItemMock).toHaveBeenCalledWith(localAccountIdKey);
    expect(result).toBeNull();
  });

  it('setLocalAccountId stores the provided user id', async () => {
    setItemMock.mockResolvedValue(undefined);

    await setLocalAccountId('user-456');

    expect(setItemMock).toHaveBeenCalledWith(localAccountIdKey, 'user-456');
  });
});