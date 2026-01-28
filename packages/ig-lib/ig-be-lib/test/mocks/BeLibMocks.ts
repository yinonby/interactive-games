
import { vi } from 'vitest';

export const initBeLibMocks = () => {
  vi.mock('@ig/be-lib', async () => {
    const actual = await vi.importActual('@ig/be-lib');

    class SilentBeLogger {
      info = vi.fn();
      warn = vi.fn();
      error = vi.fn();
      debug = vi.fn();
      trace = vi.fn();
    }

    return {
      __esModule: true,
      ...actual,
      BeLogger: SilentBeLogger,
    };
  });
}
