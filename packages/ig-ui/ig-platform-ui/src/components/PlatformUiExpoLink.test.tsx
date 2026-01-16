
import { render } from "@testing-library/react-native";
import { LinkProps as ExpoLinkProps } from "expo-router";
import type { FC } from "react";
import { Text } from "react-native";
import { PlatformUiExpoLink } from "./PlatformUiExpoLink";

// Mock Expo Router Link so we can check props
jest.mock('expo-router', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const ExpoLinkMock: FC<ExpoLinkProps> = ({ children, ...props }) => {
    return (
      <View {...props} testID="pui-expo-link-cut-tid" >{children}</View>
    );
  };

  return {
    Link: (props: ExpoLinkProps) => <ExpoLinkMock {...props} />,
  };
});

describe("PlatformUiExpoLink", () => {
  it("renders children correctly", () => {
    const { queryByTestId } = render(
      <PlatformUiExpoLink href="/test">
        <Text testID="text-tid" >Hello World</Text>
      </PlatformUiExpoLink>
    );

    expect(queryByTestId("pui-expo-link-cut-tid")).toBeTruthy();
    expect(queryByTestId("text-tid")).toBeTruthy();
  });

  it("passes href, push, and asChild props to ExpoLink", () => {
    const { queryByTestId } = render(
      <PlatformUiExpoLink href="/foo" push asChild>
        Link Text
      </PlatformUiExpoLink>
    );

    const expoLink = queryByTestId("pui-expo-link-cut-tid");

    // Check that ExpoLink was called with correct props
    expect(expoLink.props.href).toBe("/foo");
    expect(expoLink.props.push).toBe(true);
    expect(expoLink.props.asChild).toBe(true);
  });
});
