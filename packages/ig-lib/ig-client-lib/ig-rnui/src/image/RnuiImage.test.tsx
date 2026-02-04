
import type { RnuiLabelPropsT } from '@/types/ComponentTypes';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { RnuiImage, type RnuiImageSourceT } from './RnuiImage';

// Mock the RnuiLabel to a simple Text so we can inspect wrapper styles easily
jest.mock("./RnuiLabel", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');

  return {
    RnuiLabel: Text,
  }
});

describe("RnuiImage", () => {
  it("renders Image with default height", () => {
    const { getByTestId } = render(
      <RnuiImage imageSource="https://example.com/img.png" />
    );

    const container = getByTestId("container-tid");
    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.height).toBe(180);
  });

  it("renders Image with given height", () => {
    const { getByTestId } = render(
      <RnuiImage imageSource="https://example.com/img.png" height={200} />
    );

    const container = getByTestId("container-tid");
    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.height).toBe(200);
  });

  it("renders Image with string source", () => {
    const { getByTestId } = render(
      <RnuiImage imageSource="https://example.com/img.png" />
    );

    const img = getByTestId("image-tid");
    expect(img.props.source).toEqual({ uri: "https://example.com/img.png" });
  });

  it("passes non-string imageSource through to Image unchanged", () => {
    const imgSource: RnuiImageSourceT = { uri: "uri" };
    const { getByTestId } = render(
      <RnuiImage imageSource={imgSource} />
    );

    const img = getByTestId("image-tid");
    expect(img.props.source).toBe(imgSource);
  });

  it("renders no label when imgLabelProps not provided", () => {
    // default position (top-start)
    const { queryByTestId } = render(
      <RnuiImage imageSource="u" />
    );

    expect(queryByTestId("label-container")).toBeNull();
  });

  it("renders label when imgLabelProps provided, uses default position (top-start)", () => {
    const labelProps: RnuiLabelPropsT = { text: "Sample Label" };

    // default position (top-start)
    const { getByTestId } = render(
      <RnuiImage imageSource="u" imgLabelProps={labelProps} />
    );

    const labelContainer = getByTestId("label-container");
    expect(labelContainer).toBeTruthy();
    const finalLabelStyle = StyleSheet.flatten(labelContainer.props.style);
    expect(finalLabelStyle.top).toBe(8);
    expect(finalLabelStyle.start).toBe(8);
  });

  it("renders label when imgLabelProps provided, uses given position (top-end)", () => {
    const labelProps: RnuiLabelPropsT = { text: "Sample Label" };

    // default position (top-end)
    const { getByTestId } = render(
      <RnuiImage imageSource="u" imgLabelProps={labelProps} imgLabelPosition="top-end" />
    );

    const labelContainer = getByTestId("label-container");
    expect(labelContainer).toBeTruthy();
    const finalLabelStyle = StyleSheet.flatten(labelContainer.props.style);
    expect(finalLabelStyle.top).toBe(8);
    expect(finalLabelStyle.end).toBe(8);
  });
});