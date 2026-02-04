
import { render } from '@testing-library/react-native';
import React from 'react';
import { AppErrorPage } from './AppErrorPage';

describe('AppErrorPage', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <AppErrorPage/>
    );

    getByTestId('RnuiText-tid');

    const link = getByTestId('PlatformUiLink-tid');
    expect(link.props.href).toEqual('/'); // hard coded '/' to aovid and dependencies
  });
});
