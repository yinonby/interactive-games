
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import { GameStatusView } from './GameStatusView';

describe('GameStatusView', () => {
  it('renders "not started" state', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <GameStatusView gameStatus="not-started" />
    );

    getByText(buildMockedTranslation("games:gameNotStarted"));
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

    getByText(buildMockedTranslation("games:gameInProcess"));
    expect(getByTestId('blinker')).toBeTruthy();
    expect(queryByTestId('status-circle')).toBeNull();
  });

  it('renders "ended" state', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <GameStatusView gameStatus="ended" />
    );

    getByText(buildMockedTranslation("games:gameEnded"));
    expect(queryByTestId('blinker')).toBeNull();

    const circle = getByTestId('status-circle');
    expect(circle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'red' }),
      ])
    );
  });
});
