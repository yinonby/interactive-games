
import React, { createContext, useContext, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import type { GamesTranslationKeyT } from "../../types/GamesTranslationsTypes";

export interface AppLocalizationContextT {
  t: (tKey: GamesTranslationKeyT) => string,
}

const AppLocalizationContext = createContext<AppLocalizationContextT | undefined>(undefined);

type AppLocalizationProviderPropsT = object;

export const AppLocalizationProvider: React.FC<PropsWithChildren<AppLocalizationProviderPropsT>> = (props) => {
  const { children } = props;
  const { t: _t } = useTranslation();

  const t = (tKey: GamesTranslationKeyT): string => {
    return _t(tKey);
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
