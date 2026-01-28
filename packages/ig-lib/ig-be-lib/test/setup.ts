
beforeAll(async () => {
});

beforeEach(async () => {
});

afterEach(async () => {
});

afterAll(async () => {
});

vi.mock('../src/logger/BeLogger', () => {
  class SilentBeLogger {
    info = vi.fn();
    warn = vi.fn();
    error = vi.fn();
    debug = vi.fn();
    trace = vi.fn();
  }

  return {
    BeLogger: SilentBeLogger,
  };
});
