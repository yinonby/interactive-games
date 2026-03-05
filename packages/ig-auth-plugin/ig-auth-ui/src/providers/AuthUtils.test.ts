
import { __puiMocks } from '@ig/platform-ui';
import { getLocalAuthId, setLocalAuthId } from './AuthUtils';

const localAuthIdKey = 'gnm::localAuthId';

describe('AppConfigUtils', () => {
  const { getItemMock, setItemMock } = __puiMocks;
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getLocalAuthId returns stored user id', async () => {
    getItemMock.mockResolvedValue('user-123');

    const result = await getLocalAuthId();

    expect(getItemMock).toHaveBeenCalledWith(localAuthIdKey);
    expect(result).toBe('user-123');
  });

  it('getLocalAuthId returns null when no id is stored', async () => {
    getItemMock.mockResolvedValue(null);

    const result = await getLocalAuthId();

    expect(getItemMock).toHaveBeenCalledWith(localAuthIdKey);
    expect(result).toBeNull();
  });

  it('setLocalAuthId stores the provided user id', async () => {
    setItemMock.mockResolvedValue(undefined);

    await setLocalAuthId('user-456');

    expect(setItemMock).toHaveBeenCalledWith(localAuthIdKey, 'user-456');
  });
});