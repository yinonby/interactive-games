
import { __puiMocks } from '@ig/platform-ui';
import { getLocalAccountId } from './AppConfigUtils';

const localAccountIdKey = 'gnm::localAccountId';

describe('AppConfigUtils', () => {
  const { getItemMock } = __puiMocks;
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
});