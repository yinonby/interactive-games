
import React, { type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { PlatformUiLink } from '../../../../../ig-lib/ig-client-lib/ig-platform-ui';
import { RnuiAppContent, RnuiButton, RnuiText, type TestableComponentT } from '../../../../../ig-lib/ig-client-lib/ig-rnui';
import { useGenericStyles } from '../../types/GenericStyles';

type AppErrorPagePropsT = TestableComponentT;

export const AppErrorPage: React.FC<PropsWithChildren<AppErrorPagePropsT>> = () => {
  // keep this component without any dependencies
  const genericStyles = useGenericStyles();

  return (
    <RnuiAppContent>
      <View style={genericStyles.spacing}>
        <RnuiText testID='RnuiText-tid'>An unknown error has occurred</RnuiText>

        <View style={genericStyles.flexRow}>
          <PlatformUiLink testID='PlatformUiLink-tid' href='/' asChild>
            <RnuiButton>Go to home</RnuiButton>
          </PlatformUiLink>
        </View>
      </View>
    </RnuiAppContent>
  );
};
