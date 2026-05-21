
import type { AuthTranslationKeyT } from '@ig/auth-ui-models';
import type { TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

export interface AuthLocalizationT {
  t: (tKey: AuthTranslationKeyT, options?: TOptions) => string,
}

export const useAuthLocalization = (): AuthLocalizationT => {
  const { t: _t } = useTranslation();

  const t = (tKey: AuthTranslationKeyT, options?: TOptions): string => {
    const key = tKey as string;
    const defaultValue = key;
    return _t(key, defaultValue, options);
  }

  return { t };
}
