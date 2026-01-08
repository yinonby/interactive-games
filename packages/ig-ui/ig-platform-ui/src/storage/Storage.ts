
import { isWeb } from "../platform/PlatformUtils";
import type { StorageAdapter } from "../types/StorageTypes";

export const useStorage = (): StorageAdapter => {
  if (isWeb()) {
    return {
      async getItem(key) {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(key);
      },

      async setItem(key, value) {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
      },

      async removeItem(key) {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      },
    };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-async-storage/async-storage').default;
  }
}
