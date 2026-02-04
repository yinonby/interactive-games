import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from 'react-native';
import type { RnuiSnackbarPropsT } from './RnuiSnackbar';
import { RnuiSnackbarProvider, useRnuiSnackbar } from './RnuiSnackbarProvider';

jest.mock("./RnuiSnackbar", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Pressable } = require('react-native');

  const RnuiSnackbarMock: React.FC<RnuiSnackbarPropsT> = (props) => {
    const handlePress = () => {
      props.onDismiss(props.snackbarMsgInfo.uniqueKey)
    }

    return (
      <View {...props}>
        <Pressable testID="dismiss-btn-tid" onPress={handlePress}/>
      </View>
    );
  }

  return {
    RnuiSnackbar: RnuiSnackbarMock,
  }
});

describe('RnuiSnackbarProvider', () => {
  const TestChild: React.FC = () => {
    const { onShowSnackbar } = useRnuiSnackbar();

    return (
      <Button testID="btn-tid" title="btn-1" onPress={() => onShowSnackbar({ message: "msg-1" })} />
    );
  };

  it('renders children correctly', () => {
    const { queryAllByTestId, getAllByTestId, getByTestId } = render(
      <RnuiSnackbarProvider>
        <TestChild />
      </RnuiSnackbarProvider>
    );

    let snackbars = queryAllByTestId("snackbar-tid");
    expect(snackbars).toHaveLength(0);

    const btn = getByTestId("btn-tid");
    fireEvent.press(btn);

    snackbars = getAllByTestId("snackbar-tid");
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].props.index).toBe(0);
    expect(snackbars[0].props.snackbarMsgInfo.message).toBe("msg-1");
  });

  it('dismisses snackbar when onDismiss is called', () => {
    const { queryAllByTestId, getAllByTestId, getByTestId } = render(
      <RnuiSnackbarProvider>
        <TestChild />
      </RnuiSnackbarProvider>
    );

    let snackbars = queryAllByTestId("snackbar-tid");
    expect(snackbars).toHaveLength(0);

    // create 2 snackbars
    const btn = getByTestId("btn-tid");
    fireEvent.press(btn);
    fireEvent.press(btn);

    // verify 2 snackbars are created
    snackbars = getAllByTestId("snackbar-tid");
    expect(snackbars).toHaveLength(2);

    // doesn't dismiss invalid uniqueKey
    expect(snackbars[0].props.onDismiss).toBeDefined();
    act(() => {
      snackbars[0].props.onDismiss("invalid-uniqueKey");
    });

    // verify 2 snackbars still exist
    snackbars = getAllByTestId("snackbar-tid");
    expect(snackbars).toHaveLength(2);

    // dismiss first snackbar
    expect(snackbars[0].props.onDismiss).toBeDefined();
    act(() => {
      snackbars[0].props.onDismiss(snackbars[0].props.snackbarMsgInfo.uniqueKey);
    });

    // 1st snackbar is not rendered when dismissed
    snackbars = getAllByTestId("snackbar-tid");
    expect(snackbars).toHaveLength(1);
  });
});
