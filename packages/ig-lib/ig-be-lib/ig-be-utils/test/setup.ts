import type { LoggerAdapter } from '@ig/utils';

beforeAll(async () => {
});

beforeEach(async () => {
});

afterEach(async () => {
});

afterAll(async () => {
});

vi.mock('../src/logger/BeLogger', () => {
  class SilentBeLogger implements LoggerAdapter {
    info = vi.fn();
    log = vi.fn();
    warn = vi.fn();
    error = vi.fn();
    debug = vi.fn();
  }

  return {
    BeLogger: SilentBeLogger,
  };
});
