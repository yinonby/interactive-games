
import * as PlatformUtils from '../platform/PlatformUtils';
import type { StorageAdapter } from '../types/StorageTypes';
import { useStorage } from './Storage';

jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  hhh: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
}));

describe('useStorage', () => {
  const isWebSpy = jest.spyOn(PlatformUtils, "isWeb");

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('web platform', () => {
    it('uses localStorage on web', async () => {
      isWebSpy.mockReturnValue(true);

      const storageMap: Map<string, string> = new Map<string, string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).localStorage = {
        getItem: jest.fn((key: string) => storageMap.get(key) === undefined ? null : storageMap.get(key)),
        setItem: jest.fn((key: string, value: string) => { storageMap.set(key, value); }),
        removeItem: jest.fn((key: string) => { storageMap.delete(key); }),
        clear: jest.fn(() => { storageMap.clear(); }),
      };
      const getItemSpy = jest.spyOn(window.localStorage, "getItem");
      const setItemSpy = jest.spyOn(window.localStorage, "setItem");
      const removeItemSpy = jest.spyOn(window.localStorage, "removeItem");

      const storage: StorageAdapter = useStorage();

      await storage.setItem('key', 'value');
      expect(setItemSpy).toHaveBeenCalledTimes(1);

      const result = await storage.getItem('key');
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe('value');

      await storage.removeItem('key');
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      const result2 = await storage.getItem('key');
      expect(result2).toBe(null);
    });

    it('returns null on getItem during SSR', async () => {
      const getItemSpy = jest.spyOn(window.localStorage, "getItem");
      const setItemSpy = jest.spyOn(window.localStorage, "setItem");
      const removeItemSpy = jest.spyOn(window.localStorage, "removeItem");

      isWebSpy.mockReturnValue(true);

      const originalWindow = global.window;
      // @ts-expect-error temp delete non-optional to simulate this case
      delete global.window;

      const storage = useStorage();

      await storage.setItem('key', 'value');
      expect(setItemSpy).not.toHaveBeenCalled();

      const result = await storage.getItem('key');
      expect(getItemSpy).not.toHaveBeenCalled();
      expect(result).toBeNull();

      await storage.removeItem('key');
      expect(removeItemSpy).not.toHaveBeenCalled();

      global.window = originalWindow;
    });
  });

  describe('native platform', () => {
    it('returns AsyncStorage on native', async () => {
      isWebSpy.mockReturnValue(false);

      const storage = useStorage();

      expect(storage).toBe(mockAsyncStorage);
    });
  });
});
