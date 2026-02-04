
import { render } from '@testing-library/react-native';
import { useRnuiDimensions, type RnuiDimensionsT } from './RnuiDimensionsProvider';

describe('RnuiDimensionsProvider', () => {
  it('is returns correct dimensions', () => {
    let rnuiDimensions: RnuiDimensionsT | undefined;

    const TestConsumer: React.FC = () => {
      rnuiDimensions = useRnuiDimensions();
      return null;
    };

    render(<TestConsumer/>);

    expect(rnuiDimensions?.width).toBe(750);
    expect(rnuiDimensions?.height).toBe(1334);
  });
});
