
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { RnuiErrorBoundary } from './RnuiErrorBoundary';

describe('RnuiErrorBoundary', () => {
  const mockOnUnknownError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    const { getByText } = render(
      <RnuiErrorBoundary renderErrorNode={() => null}>
        <Text>Test Content</Text>
      </RnuiErrorBoundary>
    );

    getByText('Test Content');
    expect(mockOnUnknownError).not.toHaveBeenCalled();
  });

  it('should handle multiple child components', () => {
    const { getByText } = render(
      <RnuiErrorBoundary renderErrorNode={() => null}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </RnuiErrorBoundary>
    );

    getByText('Child 1');
    getByText('Child 2');
  });

  it('should handle an error is thrown while rendering', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    consoleErrorSpy.mockImplementation(() => { });
    const handleError = jest.fn();

    const TestError = () => {
      throw new Error('Test error');
    };

    const { getByTestId } = render(
      <RnuiErrorBoundary renderErrorNode={() => <View testID='ErrorView-tid' />} onError={handleError}>
        <TestError />
      </RnuiErrorBoundary>
    );

    getByTestId('ErrorView-tid');
    expect(handleError).toHaveBeenCalled();
  });

  it('should handle an error is thrown while rendering, without onError callback', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    consoleErrorSpy.mockImplementation(() => { });
    const handleError = jest.fn();

    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <RnuiErrorBoundary renderErrorNode={() => null}>
        <TestError />
      </RnuiErrorBoundary>
    );

    expect(handleError).not.toHaveBeenCalled();
  });
});