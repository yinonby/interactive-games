// components/MyTextInput.tsx
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as RnpTextInput, TextInputProps as RnpTextInputProps } from 'react-native-paper';

export type RnuiTextInputPropsT = RnpTextInputProps & {
  size?: "xs" | "small" | "medium",
}

export const RnuiTextInput: FC<RnuiTextInputPropsT> = ({
  style,
  mode = 'outlined', // default mode
  size = "small",
  ...props
}) => {
  return (
    <RnpTextInput
      testID="text-input-tid"
      mode={mode}
      style={[styles.input, style, size === "xs" && styles.xs]}
      dense={size === "small"}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white', // Paper TextInput defaults to transparent
  },
  xs: {
    height: 32,
  }
});
