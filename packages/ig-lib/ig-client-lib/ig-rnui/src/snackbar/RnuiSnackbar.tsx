
import React from 'react';
import type { ColorValue } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { RnuiText } from '../text/RnuiText';
import type { TestableComponentT } from '../types/ComponentTypes';
import type { RnuiSnackbarMessageInfoT } from '../types/RnuiSnackbarTypes';

export type RnuiSnackbarPropsT = TestableComponentT & {
  index: number,
  snackbarMsgInfo: RnuiSnackbarMessageInfoT,
  onDismiss: (uniqueKey: string) => void,
};

export const RnuiSnackbar: React.FC<RnuiSnackbarPropsT> = ({ index, snackbarMsgInfo, onDismiss }) => {
  const theme = useTheme();
  let backgroundColor: ColorValue;
  let color: ColorValue;

  if (snackbarMsgInfo.level === "err") {
    backgroundColor = theme.colors.error;
    color = theme.colors.onError;
  } else if (snackbarMsgInfo.level === "warn") {
    backgroundColor = theme.colors.tertiary;
    color = theme.colors.onTertiary;
  } else {
    backgroundColor = theme.colors.primary;
    color = theme.colors.onPrimary;
  }

  const handleDismiss = (): void => {
    onDismiss(snackbarMsgInfo.uniqueKey);
  }

  const getRemainingDurationMs = (): number => {
    const expirtyTs = snackbarMsgInfo.displayStartTs + snackbarMsgInfo.durationMs;
    const nowTs = Date.now();
    if (expirtyTs > nowTs) {
      return expirtyTs - nowTs;
    } else {
      return 0;
    }
  }

  const durationMs = getRemainingDurationMs();
  if (durationMs === 0) {
    return null;
  }

  return (
    <Snackbar
      testID="snackbar-tid"
      style={{
        position: 'absolute',
        bottom: 20 + index * 60, // 60px offset per snack
        left: 233,
        right: 233,
        backgroundColor: backgroundColor,
      }}
      visible
      onDismiss={handleDismiss}
      duration={durationMs}
      action={snackbarMsgInfo.withCloseButton ? {
        label: '✕', // close button text
        textColor: color,
        testID: "close-btn-tid"
      } : undefined}
    >
      <RnuiText style={{ color: color }}>
        {snackbarMsgInfo.message}
      </RnuiText>
    </Snackbar>
  );
}
