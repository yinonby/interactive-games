
import { render } from '@testing-library/react-native';
import { RnuiBlinker } from './RnuiBlinker';

describe('RnuiBlinker', () => {
  it('renders a circle with the correct blink color', () => {
    const { getByTestId } = render(
      <RnuiBlinker color="orange" durationMs={500} />
    );

    const circle = getByTestId('blinker-circle');

    // The background color prop should match
    expect(circle.props.style).toEqual(
      expect.objectContaining({ backgroundColor: 'orange' }),
    );
  });

  it('applies correct styles', () => {
    const { getByTestId } = render(
      <RnuiBlinker color="green" durationMs={300} />
    );

    const circle = getByTestId('blinker-circle');
    const style = circle.props.style;

    // Check dimensions
    const combinedStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;

    expect(combinedStyle.width).toBe(12);
    expect(combinedStyle.height).toBe(12);
    expect(combinedStyle.borderRadius).toBe(6);
    expect(combinedStyle.marginRight).toBe(6);
  });
});
