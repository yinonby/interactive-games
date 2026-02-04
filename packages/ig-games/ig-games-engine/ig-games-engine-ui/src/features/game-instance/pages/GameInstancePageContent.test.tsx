
import { render } from '@testing-library/react-native';
import React from 'react';
import { GameInstancePageContent } from './GameInstancePageContent';

// mocks
jest.mock('../dashboard/components/GameInstanceContainer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GameInstanceContainer: View,
  };
});

describe('GameInstancePageContent', () => {
  it('renders properly', async () => {
    const { queryByTestId } = render(
      <GameInstancePageContent gameInstanceId='giid-1'/>
    );

    expect(queryByTestId('app-content-tid')).toBeTruthy();
    const acceptInviteView = queryByTestId('game-instance-container-tid');
    expect(acceptInviteView).toBeTruthy();
    expect(acceptInviteView.props.gameInstanceId).toBe('giid-1');
  });
});
