
import { fireEvent, render } from "@testing-library/react-native";
import * as RNP from 'react-native-paper';
import type { RnuiSnackbarMessageInfoT } from "../types/RnuiSnackbarTypes";
import { RnuiSnackbar } from "./RnuiSnackbar";

// mocks

jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Pressable } = require('react-native');

  const SnackbarMock: React.FC<RNP.SnackbarProps> = (props) => {
    const timeoutId = setTimeout(() => {
      props.onDismiss()
    }, props.duration);

    const handlePress = () => {
      clearTimeout(timeoutId);
      props.onDismiss();
    }

    return (
      <View {...props}>
        {props.action && <Pressable testID="close-btn-tid" onPress={handlePress}/>}
        {props.children}
      </View>
    );
  }

  return {
    Snackbar: SnackbarMock,
    useTheme: jest.fn(),
  };
});

jest.mock("../text/RnuiText", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');

  return {
    RnuiText: Text,
  }
});

// tests

describe("RnuiSnackbar", () => {
  const useThemeSpy = jest.spyOn(RNP, "useTheme");
  const infoBackgroundColor = "green";
  const infoTextColor = "red";
  const warnBackgroundColor = "green";
  const warnTextColor = "red";
  const errBackgroundColor = "green";
  const errTextColor = "red";
  const startTimeTs = 2500;

  beforeAll(() => {
    useThemeSpy.mockReturnValue({
      colors: {
        primary: infoBackgroundColor,
        onPrimary: infoTextColor,
        tertiary: warnBackgroundColor,
        onTertiary: warnTextColor,
        error: errBackgroundColor,
        onError: errTextColor,
      }
    });
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.setSystemTime(startTimeTs);
  })

  it("renders message", () => {
    const index = 2;
    const uniqueKey = "uk1";
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey,
      message: "Test message",
      level: "err",
      withCloseButton: true,
      displayStartTs: startTimeTs,
      durationMs: 5000, // 5s duration
    };
    const onDismiss = jest.fn(() => { });

    const { getByText } = render(
      <RnuiSnackbar index={index} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    // message rendered
    getByText("Test message");
  });

  it("computes duration and calls onDismiss when duration elapses", () => {
    const index = 2;
    const uniqueKey = "uk1";
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey,
      message: "Test message",
      level: "err",
      withCloseButton: true,
      displayStartTs: startTimeTs,
      durationMs: 5000, // 5s duration
    };

    jest.advanceTimersByTime(1000);

    let calledKey = "";
    const onDismiss = jest.fn((k: string) => { calledKey = k; });

    const { getByTestId } = render(
      <RnuiSnackbar index={index} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = getByTestId("snackbar-tid");
    // remaining duration = (displayStartTs + durationMs) - now = (now-1000+5000)-now = 4000
    expect(snack.props.duration).toBe(4000);
    expect(onDismiss).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3999);
    expect(onDismiss).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalled();
    expect(calledKey).toBe(uniqueKey);
  });

  it("doesn't render when duration is 0 (snackbar expired)", () => {
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey: "uk3",
      message: "Expired",
      level: "warn",
      withCloseButton: false,
      displayStartTs: startTimeTs, // started 10s ago
      durationMs: 1000, // only 1s duration
    };

    jest.advanceTimersByTime(10000);

    const onDismiss = jest.fn(() => { });

    const { queryByTestId } = render(
      <RnuiSnackbar index={1} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = queryByTestId("snackbar-tid");
    expect(snack).toBeNull();
  });

  it("does not provide an action when withCloseButton is false", () => {
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey: "uk2",
      message: "No close",
      level: "info",
      withCloseButton: false,
      displayStartTs: startTimeTs,
      durationMs: 2000,
    };

    const onDismiss = jest.fn(() => { });

    const { getByTestId, queryByTestId } = render(
      <RnuiSnackbar index={0} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = getByTestId("snackbar-tid");

    // action should be undefined when no close button
    expect(snack.props.action).toBeUndefined();

    // close button should not be present
    expect(queryByTestId("close-btn-tid")).toBeNull();
  });

  it("calls onDismiss when close button pressed", () => {
    const index = 2;
    const uniqueKey = "uk1";
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey,
      message: "Test message",
      level: "err",
      withCloseButton: true,
      displayStartTs: startTimeTs,
      durationMs: 5000, // 5s duration
    };

    let calledKey = "";
    const onDismiss = jest.fn((k: string) => { calledKey = k; });

    const { getByTestId } = render(
      <RnuiSnackbar index={index} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = getByTestId("snackbar-tid");

    // close button exists and pressing it should trigger onDismiss with uniqueKey
    expect(snack.props.action).toBeDefined();
    expect(snack.props.action.label).toBe('✕');
    expect(onDismiss).not.toHaveBeenCalled();

    // onDismiss is called when button is pressed
    const closeBtn = getByTestId("close-btn-tid");
    fireEvent.press(closeBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(calledKey).toBe(uniqueKey);

    // timeout callback is cleared and onDismiss is not called again from timeout
    jest.advanceTimersByTime(10000);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses correct styles for info snackbar, with button", () => {
    const index = 2;
    const uniqueKey = "uk1";
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey,
      message: "Test message",
      level: "err",
      withCloseButton: true,
      displayStartTs: startTimeTs,
      durationMs: 5000, // 5s duration
    };

    const onDismiss = jest.fn(() => { });

    const { getByTestId } = render(
      <RnuiSnackbar index={index} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = getByTestId("snackbar-tid");

    expect(snack.props.style.backgroundColor).toBe(infoBackgroundColor);
    expect(snack.props.action).toBeDefined();
    expect(snack.props.action.textColor).toBe(infoTextColor);
  });

  it("uses correct styles for warn snackbar, with button", () => {
    const index = 2;
    const uniqueKey = "uk1";
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey,
      message: "Test message",
      level: "err",
      withCloseButton: true,
      displayStartTs: startTimeTs,
      durationMs: 5000, // 5s duration
    };

    const onDismiss = jest.fn(() => { });

    const { getByTestId } = render(
      <RnuiSnackbar index={index} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = getByTestId("snackbar-tid");

    expect(snack.props.style.backgroundColor).toBe(warnBackgroundColor);
    expect(snack.props.action).toBeDefined();
    expect(snack.props.action.textColor).toBe(warnTextColor);
  });

  it("uses correct styles for err snackbar, with button", () => {
    const index = 2;
    const uniqueKey = "uk1";
    const snackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey,
      message: "Test message",
      level: "err",
      withCloseButton: true,
      displayStartTs: startTimeTs,
      durationMs: 5000, // 5s duration
    };

    const onDismiss = jest.fn(() => { });

    const { getByTestId } = render(
      <RnuiSnackbar index={index} snackbarMsgInfo={snackbarMsgInfo} onDismiss={onDismiss} />
    );

    const snack = getByTestId("snackbar-tid");

    expect(snack.props.style.backgroundColor).toBe(errBackgroundColor);
    expect(snack.props.action).toBeDefined();
    expect(snack.props.action.textColor).toBe(errTextColor);
  });
});
