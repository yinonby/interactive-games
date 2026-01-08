
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameStatusView } from './GameStatusView';

describe('GameStatusView', () => {
  it('renders "not started" state', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <GameStatusView gameStatus="not-started" />
    );

    expect(getByText('Game not started')).toBeTruthy();
    expect(queryByTestId('blinker')).toBeNull();

    const circle = getByTestId('status-circle');
    expect(circle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'orange' }),
      ])
    );
  });

  it('renders "in process" state with blinker', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <GameStatusView gameStatus="in-process" />
    );

    expect(getByText('Game in process')).toBeTruthy();
    expect(getByTestId('blinker')).toBeTruthy();
    expect(queryByTestId('status-circle')).toBeNull();
  });

  it('renders "ended" state', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <GameStatusView gameStatus="ended" />
    );

    expect(getByText('Game ended')).toBeTruthy();
    expect(queryByTestId('blinker')).toBeNull();

    const circle = getByTestId('status-circle');
    expect(circle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'red' }),
      ])
    );
  });
});
