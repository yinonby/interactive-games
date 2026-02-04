
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { RnuiTable } from './RnuiTable';

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    DataTable: View,
  };
});

describe('RnuiTable', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTable ><Text testID="text-test-id">Hello</Text></RnuiTable>
    );

    const cut = getByTestId('DataTable-tid');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
