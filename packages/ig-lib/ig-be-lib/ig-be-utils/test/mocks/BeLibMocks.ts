
import type { LoggerAdapter } from '@ig/utils';
import { vi } from 'vitest';

export const initBeLibMocks = () => {
  vi.mock('@ig/be-utils', async () => {
    const actual = await vi.importActual('@ig/be-utils');

    class SilentBeLogger implements LoggerAdapter {
      debug = vi.fn();
      info = vi.fn();
      log = vi.fn();
      warn = vi.fn();
      error = vi.fn();
    }

    return {
      __esModule: true,
      ...actual,
      BeLogger: SilentBeLogger,
    };
  });
}
