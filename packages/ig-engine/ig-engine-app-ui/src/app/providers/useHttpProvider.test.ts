
import { useHttpProvider } from './useHttpProvider';

describe('useHttpProvider', () => {
  it('returns an HttpProvider', () => {
    const httpProvider = useHttpProvider("fake-url", true);

    expect(httpProvider).not.toBeNull();
  });
});
