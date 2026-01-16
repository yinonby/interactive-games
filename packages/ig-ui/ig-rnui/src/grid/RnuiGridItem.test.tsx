
import { render } from '@testing-library/react-native';
import { Text } from "react-native";
import { RnuiGridItem } from "./RnuiGridItem";

describe('RnuiGridItem', () => {
  it('renders correctly with defaults', () => {
    const { getByText } = render(<RnuiGridItem><Text>Hello</Text></RnuiGridItem>);

    expect(getByText("Hello")).toBeTruthy();
  });
});
