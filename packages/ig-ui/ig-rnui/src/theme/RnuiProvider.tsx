
import React, { createContext, useContext, type PropsWithChildren } from 'react';
import type { ColorValue, TextStyle } from "react-native";
import { ThemeProvider, type MD3Theme } from "react-native-paper";
import { RnuiSnackbarProvider } from "../snackbar/RnuiSnackbarProvider";

export type RnuiStylesT = {
  xsButtonLabelStyle?: TextStyle,
  imageLabel?: {
    textColor?: ColorValue,
    backgroundColor?: ColorValue,
    borderRadius?: number,
    paddingHorizontal?: number,
    paddingVertical?: number,
  },
  tableRow?: {
    denseMinHeight?: number,
  },
}

export interface RnuiContextT {
  rnuiStyles: RnuiStylesT,
}

export type RnuiProviderPropsT = {
  theme?: MD3Theme,
  rnuiStyles?: RnuiStylesT,
};

const RnuiContext = createContext<RnuiContextT | undefined>(undefined);

// create the context provider
export const RnuiProvider: React.FC<PropsWithChildren<RnuiProviderPropsT>> = (props) => {
  const { theme, rnuiStyles, children } = props;

  const value: RnuiContextT = {
    rnuiStyles: rnuiStyles || {},
  }

  return (
    <RnuiContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <RnuiSnackbarProvider /* depends on ThemeProvider */>
          {children}
        </RnuiSnackbarProvider>
      </ThemeProvider>
    </RnuiContext.Provider>
  );
};

export const useRnuiContext = (): RnuiContextT => useContext(RnuiContext) as RnuiContextT;
