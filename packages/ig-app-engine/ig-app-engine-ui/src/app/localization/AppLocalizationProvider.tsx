
import type { TOptions } from 'i18next';
import React, { createContext, useContext, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppTranslationKeyT } from '../../types/CommonTranslationTypes';

export interface AppLocalizationContextT {
  t: (tKey: AppTranslationKeyT, options?: TOptions) => string,
}

const AppLocalizationContext = createContext<AppLocalizationContextT | undefined>(undefined);

type AppLocalizationProviderPropsT = object;

export const AppLocalizationProvider: React.FC<PropsWithChildren<AppLocalizationProviderPropsT>> = (props) => {
  const { children } = props;
  const { t: _t } = useTranslation();

  const t = (tKey: AppTranslationKeyT, options?: TOptions): string => {
    return _t(tKey, options);
  }

  const value: AppLocalizationContextT = {
    t: t,
  }

  return (
    <AppLocalizationContext.Provider value={value}>
      {children}
    </AppLocalizationContext.Provider>
  );
};

export const useAppLocalization = (): AppLocalizationContextT =>
  useContext(AppLocalizationContext) as AppLocalizationContextT;
