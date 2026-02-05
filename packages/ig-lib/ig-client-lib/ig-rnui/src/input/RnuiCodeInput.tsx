
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type ColorValue,
  type TextStyle,
  type ViewStyle
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import type { TestableComponentT } from '../types/ComponentTypes';
import { isAndroid } from '../utils/RnuiUtils';

type RnuiCodeInputPropsT = TestableComponentT & {
  length: number;
  value?: string,
  onChange?: (value: string) => void;
  size?: 'xs' | 'small',
  numeric?: boolean;
  textOnly?: boolean;
  disabled?: boolean,
  tileTextColors?: ColorValue[],
  tileBackgroundColors?: ColorValue[],
  smsAutocomplete?: boolean,
};

export const RnuiCodeInput: React.FC<RnuiCodeInputPropsT> = (props) => {
  const {
    length,
    value,
    onChange,
    size = 'small',
    numeric = false,
    textOnly = false,
    disabled = false,
    tileTextColors,
    tileBackgroundColors,
    smsAutocomplete = false,
  } = props;
  const [nonControlledValue, setNonControlledValue] = useState('');
  const actualValue = value === undefined ? nonControlledValue : value;
  const actualSetValue = (value && onChange) ? onChange : setNonControlledValue;
  const autoComplete = smsAutocomplete ? (isAndroid() ? 'sms-otp' : 'one-time-code') : 'off';

  const ref = useBlurOnFulfill({ value: actualValue, cellCount: length });

  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: actualValue,
    setValue: actualSetValue,
  });

  const handleChange = (val: string) => {
    if (numeric && !/^\d*$/.test(val)) return;
    if (textOnly && !/^[a-zA-Z]*$/.test(val)) return;

    actualSetValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  const getCellBackgroundColorStyle = (index: number): ViewStyle | undefined => {
    if (tileBackgroundColors && index < tileBackgroundColors.length) {
      return { backgroundColor: tileBackgroundColors[index] };
    } else {
      return undefined;
    }
  }

  const getCellTextColorStyle = (index: number): TextStyle | undefined => {
    if (tileTextColors && index < tileTextColors.length) {
      return { color: tileTextColors[index] };
    } else {
      return undefined;
    }
  }

  const renderCell = (props: { index: number, symbol: string, isFocused: boolean }) => {
    const { index, symbol, isFocused } = props;

    return (
      <View
        testID='View-cell-tid'
        key={index}
        onLayout={getCellOnLayoutHandler(index)}
        style={[
          styles.cell,
          isFocused && !disabled && styles.focusCell,
          size === 'xs' && styles.cellXs,
          getCellBackgroundColorStyle(index),
        ]}
      >
        <Text
          testID='Text-cell-tid'
          style={[
            styles.cellText,
            getCellTextColorStyle(index),
          ]}
        >
          {symbol || (isFocused && !disabled ? <Cursor /> : null)}
        </Text>
      </View>
    );
  }

  return (
    <CodeField
      testID='CodeField-tid'
      ref={ref}
      {...fieldProps}
      rootStyle={styles.container}
      value={actualValue}
      onChangeText={handleChange}
      cellCount={length}
      InputComponent={TextInput}
      keyboardType={numeric ? 'number-pad' : 'default'}
      textContentType="oneTimeCode"
      editable={!disabled}
      readOnly={disabled}
      autoComplete={autoComplete}
      renderCell={renderCell}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -4,
  },
  cell: {
    width: 32,
    height: 40,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellSm: {
    width: 32,
    height: 40,
  },
  cellXs: {
    width: 25,
    height: 32,
  },
  focusCell: {
    borderColor: '#3b82f6',
  },
  cellText: {
    fontSize: 24,
    textAlign: 'center',
  },
});
