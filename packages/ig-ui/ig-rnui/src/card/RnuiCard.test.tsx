
import { render } from '@testing-library/react-native';
import { StyleSheet } from "react-native";
import { RnuiCard } from "./RnuiCard";

// Mock the RnuiImage to a simple Text so we can inspect wrapper styles easily
jest.mock("../image/RnuiImage", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    RnuiImage: View,
  }
});

describe("RnuiCard", () => {
  it("renders card with content", () => {
    const { getByTestId } = render(
      <RnuiCard>Hello</RnuiCard>
    );

    const content = getByTestId("content-tid");
    expect(content).toBeTruthy();
    expect(content.props.children).toBe("Hello");
  });

  it("renders card with no height", () => {
    const { getByTestId } = render(
      <RnuiCard>Hello</RnuiCard>
    );

    const container = getByTestId("container-tid");
    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.height).toBeUndefined();
  });

  it("renders card with given height", () => {
    const { getByTestId } = render(
      <RnuiCard height={200}>Hello</RnuiCard>
    );

    const container = getByTestId("container-tid");
    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.height).toBe(200);
  });

  it("renders card with no image", () => {
    const { queryByTestId } = render(
      <RnuiCard>Hello</RnuiCard>
    );

    const image = queryByTestId("image-tid");
    expect(image).toBeNull();
  });

  it("renders card with image", () => {
    const { queryByTestId } = render(
      <RnuiCard imageProps={{ imageSource: "test-image.jpg" }}>Hello</RnuiCard>
    );

    const image = queryByTestId("image-tid");
    expect(image).toBeTruthy();
  });
});