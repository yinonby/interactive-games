
import type { RnuiLabelPropsT } from "@/types/ComponentTypes";
import { render } from '@testing-library/react-native';
import { StyleSheet } from "react-native";
import * as RnuiProvider from "../theme/RnuiProvider";
import { RnuiLabel } from "./RnuiLabel";

describe('RnuiLabel', () => {
  const useRnuiContextSpy = jest.spyOn(RnuiProvider, 'useRnuiContext');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with defaults', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const labelProps: RnuiLabelPropsT = {
      text: 'Sample Label',
    }
    const { getByTestId, getByText } = render(<RnuiLabel {...labelProps} />);

    const container = getByTestId('container-tid');
    expect(container).toBeTruthy();

    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.backgroundColor).toBe("black");
    expect(containerFinalStyle.borderRadius).toBe(8);
    expect(containerFinalStyle.paddingHorizontal).toBe(8);
    expect(containerFinalStyle.paddingVertical).toBe(4);

    const labelText = getByTestId('label-text-tid');
    expect(labelText).toBeTruthy();

    const labelFinalStyle = StyleSheet.flatten(labelText.props.style);
    expect(labelFinalStyle.color).toBe("white");

    expect(labelText.props.children).toBe('Sample Label');

    expect(getByText('Sample Label')).toBeTruthy();
  });

  it('renders correctly with rnuiStyle props', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {
        imageLabel: {
          textColor: "red",
          backgroundColor: "green",
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }
      }
    });

    const labelProps: RnuiLabelPropsT = {
      text: 'Sample Label',
    }
    const { getByTestId, getByText } = render(<RnuiLabel {...labelProps} />);

    const container = getByTestId('container-tid');
    expect(container).toBeTruthy();

    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.backgroundColor).toBe("green");
    expect(containerFinalStyle.borderRadius).toBe(10);
    expect(containerFinalStyle.paddingHorizontal).toBe(10);
    expect(containerFinalStyle.paddingVertical).toBe(5);

    const labelText = getByTestId('label-text-tid');
    expect(labelText).toBeTruthy();

    const labelFinalStyle = StyleSheet.flatten(labelText.props.style);
    expect(labelFinalStyle.color).toBe("red");

    expect(labelText.props.children).toBe('Sample Label');
    expect(getByText('Sample Label')).toBeTruthy();
  });

  it('renders correctly with component props overriding rnuiStyle', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {
        imageLabel: {
          textColor: "red",
          backgroundColor: "green",
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }
      }
    });

    const labelProps: RnuiLabelPropsT = {
      text: 'Sample Label',
      textColor: "blue",
      backgroundColor: "yellow",
    }
    const { getByTestId, getByText } = render(<RnuiLabel {...labelProps} />);

    const container = getByTestId('container-tid');
    expect(container).toBeTruthy();

    const containerFinalStyle = StyleSheet.flatten(container.props.style);
    expect(containerFinalStyle.backgroundColor).toBe("yellow");

    const labelText = getByTestId('label-text-tid');
    expect(labelText).toBeTruthy();

    const labelFinalStyle = StyleSheet.flatten(labelText.props.style);
    expect(labelFinalStyle.color).toBe("blue");

    expect(labelText.props.children).toBe('Sample Label');
    expect(getByText('Sample Label')).toBeTruthy();
  });
});
