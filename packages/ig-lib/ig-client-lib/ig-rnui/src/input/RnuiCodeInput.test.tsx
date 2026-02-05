
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import {
  CodeFieldProps
} from 'react-native-confirmation-code-field';
import * as RnuiUtils from '../utils/RnuiUtils';
import { RnuiCodeInput } from './RnuiCodeInput';

jest.mock('react-native-confirmation-code-field', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    CodeField: ({ renderCell, cellCount, testID, ...rest }: CodeFieldProps) => (
      <View testID={testID} {...rest} >
        {cellCount !== undefined && Array.from({ length: cellCount }).map((_, index) =>
          renderCell({ index, symbol: '', isFocused: index === 0 })
        )}
      </View>
    ),
    Cursor: () => null,
    useBlurOnFulfill: jest.fn(() => null),
    useClearByFocusCell: jest.fn(() => [
      {},
      jest.fn(),
    ]),
  };
});

describe('RnuiCodeInput', () => {
  const isAndroidSpy = jest.spyOn(RnuiUtils, 'isAndroid');

  it('renders the correct number of cells', () => {
    const { getAllByTestId } = render(
      <RnuiCodeInput length={4} />
    );

    expect(getAllByTestId('View-cell-tid')).toHaveLength(4);
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <RnuiCodeInput length={4} onChange={onChange} />
    );

    fireEvent(getByTestId('CodeField-tid'), 'onChangeText', '12');

    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('no call to onChange when input changes and onChange is undefined', () => {
    const { getByTestId } = render(
      <RnuiCodeInput length={4} />
    );

    fireEvent(getByTestId('CodeField-tid'), 'onChangeText', '12');
  });

  it('blocks non-numeric input when numeric=true', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <RnuiCodeInput length={4} numeric onChange={onChange} />
    );

    fireEvent(getByTestId('CodeField-tid'), 'onChangeText', 'ab');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('blocks non-text input when textOnly=true', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <RnuiCodeInput length={4} textOnly onChange={onChange} />
    );

    fireEvent(getByTestId('CodeField-tid'), 'onChangeText', '123');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders disabled state correctly', () => {
    const { getByTestId } = render(
      <RnuiCodeInput length={4} disabled />
    );

    const codeField = getByTestId('CodeField-tid');

    expect(codeField.props.editable).toBe(false);
    expect(codeField.props.readOnly).toBe(true);
  });

  it('applies size small', () => {
    const { getAllByTestId } = render(
      <RnuiCodeInput length={2} size='small' />
    );

    const cells = getAllByTestId('View-cell-tid');

    const cellStyle = StyleSheet.flatten(cells[0].props.style);
    expect(cellStyle.width).toEqual(32);
    expect(cellStyle.height).toEqual(40);
  });

  it('applies size xs', () => {
    const { getAllByTestId } = render(
      <RnuiCodeInput length={2} size='xs' />
    );

    const cells = getAllByTestId('View-cell-tid');

    const cellStyle = StyleSheet.flatten(cells[0].props.style);
    expect(cellStyle.width).toEqual(25);
    expect(cellStyle.height).toEqual(32);
  });

  it('applies custom tile background colors', () => {
    const cellBackgroundColors = ['red', 'blue'];

    const { getAllByTestId } = render(
      <RnuiCodeInput length={2} tileBackgroundColors={cellBackgroundColors} />
    );

    const cells = getAllByTestId('View-cell-tid');

    expect(cells[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'red' })])
    );
    expect(cells[1].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'blue' })])
    );
  });

  it('applies custom tile text colors', () => {
    const cellTextColors = ['red', 'blue'];

    const { getAllByTestId } = render(
      <RnuiCodeInput length={2} tileTextColors={cellTextColors} />
    );

    const texts = getAllByTestId('Text-cell-tid');

    expect(texts[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: 'red' })])
    );
    expect(texts[1].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: 'blue' })])
    );
  });

  it('uses controlled value when value prop is provided', () => {
    const onChange = jest.fn();

    render(
      <RnuiCodeInput
        length={4}
        value="1234"
        onChange={onChange}
      />
    );

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not use smsAutocomplete', () => {
    const { getByTestId } = render(
      <RnuiCodeInput length={4} />
    );

    const codeField = getByTestId('CodeField-tid');

    expect(codeField.props.autoComplete).toBe('off');
  });

  it('uses smsAutocomplete, non-android', () => {
    isAndroidSpy.mockReturnValue(false);

    const { getByTestId } = render(
      <RnuiCodeInput length={4} smsAutocomplete />
    );

    const codeField = getByTestId('CodeField-tid');

    expect(codeField.props.autoComplete).toBe('one-time-code');
  });

  it('uses smsAutocomplete, android', () => {
    isAndroidSpy.mockReturnValue(true);

    const { getByTestId } = render(
      <RnuiCodeInput length={4} smsAutocomplete />
    );

    const codeField = getByTestId('CodeField-tid');

    expect(codeField.props.autoComplete).toBe('sms-otp');
  });
});
