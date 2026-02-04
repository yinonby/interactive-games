
import { render } from '@testing-library/react-native';
import { RnuiActivityIndicator } from './RnuiActivityIndicator';

// mocks

// Mock react-native-paper ActivityIndicator
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');


  return {
    ActivityIndicator: View,
  };
});

// tests

describe("RnuiActivityIndicator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders RnuiActivityIndicator with defaults", () => {
    const { getByTestId } = render(
      <RnuiActivityIndicator/>
    );

    const cut = getByTestId("activity-indicator-tid");
    expect(cut).toBeTruthy();
  });

  it("renders RnuiActivityIndicator with size", () => {
    const { getByTestId } = render(
      <RnuiActivityIndicator size={"small"} />
    );

    const cut = getByTestId("activity-indicator-tid");
    expect(cut).toBeTruthy();
    expect(cut.props.size).toBe("small");
  });
});
