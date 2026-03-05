
import { useGenericStyles } from '@ig/app-engine-ui';
import type { AuthIdT } from '@ig/auth-models';
import { RnuiButton, RnuiCard, RnuiTextInput, type TestableComponentT } from '@ig/rnui';
import React, { useState, type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuthController } from '../model/controllers/user-actions/AuthController';
import { useAuthLocalization } from './AuthLocalization';

export type AuthLoginViewPropsT = TestableComponentT & {
  onAuthGuestLogin?: (authId: AuthIdT) => void,
};

export const AuthLoginView: FC<AuthLoginViewPropsT> = ({ onAuthGuestLogin }) => {
  const { t } = useAuthLocalization();
  const { onGuestLogin } = useAuthController();
  const [nickname, setNickname] = useState('');
  const genericStyles = useGenericStyles();

  const handleGuestLogin = async (): Promise<void> => {
    if (nickname === '') {
      return;
    }
    const authId = await onGuestLogin(nickname);

    if (onAuthGuestLogin) {
      onAuthGuestLogin(authId);
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={[genericStyles.flexRow, genericStyles.justifyContentCenter]}>
        <RnuiCard>
          <View style={[genericStyles.spacing]}>
            <RnuiTextInput
              testID='RnuiTextInput-nickname-tid'
              label={t('auth:nickname')}
              onChangeText={setNickname}
            />

            <RnuiButton
              testID='RnuiButton-guestLogin-tid'
              onPress={handleGuestLogin}
            >
              {t('auth:guestLogin')}
            </RnuiButton>
          </View>
        </RnuiCard>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
