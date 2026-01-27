
import { render } from "@testing-library/react-native";
import { LinkProps as ExpoLinkProps } from "expo-router";
import type { FC } from "react";
import { Text } from "react-native";
import { PlatformUiLink } from "./PlatformUiLink";

// Mock Expo Router Link so we can check props
jest.mock('./PlatformUiExpoLink', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const PlatformUiExpoLinkMock: FC<ExpoLinkProps> = ({ children, ...props }) => {
    return (
      <View {...props} testID="pui-link-cut-tid" >{children}</View>
    );
  };

  return {
    PlatformUiExpoLink: (props: ExpoLinkProps) => <PlatformUiExpoLinkMock {...props} />,
  };
});

describe("PlatformUiLink", () => {
  it("renders children correctly", () => {
    const { queryByTestId } = render(
      <PlatformUiLink href="/test">
        <Text testID="text-tid" >Hello World</Text>
      </PlatformUiLink>
    );

    expect(queryByTestId("pui-link-cut-tid")).toBeTruthy();
    expect(queryByTestId("text-tid")).toBeTruthy();
  });

  it("passes href, push, and asChild props to PlatformUiExpoLink", () => {
    const { queryByTestId } = render(
      <PlatformUiLink href="/foo" push asChild>
        Link Text
      </PlatformUiLink>
    );

    const expoLink = queryByTestId("pui-link-cut-tid");

    // Check that ExpoLink was called with correct props
    expect(expoLink.props.href).toBe("/foo");
    expect(expoLink.props.push).toBe(true);
    expect(expoLink.props.asChild).toBe(true);
  });
});
