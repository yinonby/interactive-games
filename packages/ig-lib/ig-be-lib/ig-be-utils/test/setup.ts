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
    trace = vi.fn();
    info = vi.fn();
    warn = vi.fn();
    error = vi.fn();
    debug = vi.fn();
  }

  return {
    BeLogger: SilentBeLogger,
  };
});
