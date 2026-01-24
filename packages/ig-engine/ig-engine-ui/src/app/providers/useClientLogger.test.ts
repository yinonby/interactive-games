
jest.unmock("./useClientLogger");

import { useClientLogger } from "./useClientLogger";

describe('useClientLogger', () => {
  it('returns a ConsoleLogger instance', () => {
    const logger = useClientLogger();

    expect(logger).not.toBeNull();
  });
});
