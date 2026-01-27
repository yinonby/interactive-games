
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { RnuiAppContent } from "./RnuiAppContent";

// tests

describe("RnuiAppContent", () => {
  it("renders the ScrollView wrapper", () => {
    const { getByTestId } = render(
      <RnuiAppContent>
        <Text>Child content</Text>
      </RnuiAppContent>
    );

    expect(getByTestId("scroll-view-tid")).toBeTruthy();
  });

  it("renders children inside the ScrollView", () => {
    const { getByText } = render(
      <RnuiAppContent>
        <Text>Child content</Text>
      </RnuiAppContent>
    );

    expect(getByText("Child content")).toBeTruthy();
  });
});
