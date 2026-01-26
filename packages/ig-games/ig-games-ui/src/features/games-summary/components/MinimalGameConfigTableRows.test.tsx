
import { buildTestMinimalGameConfig } from '@ig/games-models/test-utils';
import { MIN_TO_MS } from '@ig/lib';
import { render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../test/mocks/EngineAppUiMocks';
import { MinimalGameConfigTableRows } from './MinimalGameConfigTableRows';

// Mock PriceView to render easily queryable output
jest.mock('./PriceView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    PriceView: View,
  };
});

describe('MinimalGameConfigTableRows', () => {
  it('renders correctly', async () => {
    const { getByText } = render(
      <MinimalGameConfigTableRows
        minimalGameConfig={buildTestMinimalGameConfig({
          maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(6) },
          gamePriceInfo: { kind: 'free' },
          maxParticipants: 4,
        })}
      />
    );

    getByText(buildMockedTranslation('common:duration'));
    getByText(buildMockedTranslation('common:minutes'));
    getByText(buildMockedTranslation('games:maxParticipants'));
    getByText('4');
    getByText(buildMockedTranslation('common:price'));
  });

  it('renders correctly, duration is unlimited', async () => {
    const { getByText } = render(
      <MinimalGameConfigTableRows
        minimalGameConfig={buildTestMinimalGameConfig({
          maxDurationInfo: { kind: 'unlimited' },
          gamePriceInfo: { kind: 'free' },
          maxParticipants: 4,
        })}
      />
    );

    getByText(buildMockedTranslation('common:unlimited'));
  });
});
