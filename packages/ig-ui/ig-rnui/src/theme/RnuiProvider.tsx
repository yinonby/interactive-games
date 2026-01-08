
import React, { createContext, ReactElement, useContext } from 'react';
import type { ColorValue, TextStyle } from "react-native";
import { ThemeProvider, type MD3Theme } from "react-native-paper";

export type RnuiStylesT = {
  xsButtonLabelStyle?: TextStyle,
  imageLabel?: {
    textColor?: ColorValue,
    backgroundColor?: ColorValue,
    borderRadius?: number,
    paddingHorizontal?: number,
    paddingVertical?: number,
  }
}

export type RnuiProviderPropsT = {
  theme?: MD3Theme,
  rnuiStyles?: RnuiStylesT,
  children: ReactElement | ReactElement[],
};

export interface RnuiContextT {
  rnuiStyles: RnuiStylesT,
}

const RnuiContext = createContext<RnuiContextT | undefined>(undefined);

export const RnuiProvider: React.FC<RnuiProviderPropsT> = ({ theme, rnuiStyles, children }) => {
  return (
    <RnuiContext.Provider value={{ rnuiStyles: rnuiStyles || {} }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </RnuiContext.Provider>
  );
};

export const useRnuiContext = (): RnuiContextT => useContext(RnuiContext) as RnuiContextT;
