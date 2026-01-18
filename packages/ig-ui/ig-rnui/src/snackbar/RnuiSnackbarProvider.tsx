
import { generateUuidv4 } from "@ig/lib";
import React, { createContext, ReactElement, useContext, useState } from 'react';
import { View } from "react-native";
import {
  RNUI_SNACKBAR_DEFAULT_DURATION_MS, type RnuiSnackbarMessageInfoT,
  type RnuiSnackbarMessageRequestT
} from "../types/RnuiSnackbarTypes";
import { RnuiSnackbar } from "./RnuiSnackbar";

export type RnuiSnackbarOnShowFn = (snackbarMsgRequest: RnuiSnackbarMessageRequestT) => void;

export interface RnuiSnackbarContextT {
  onShowSnackbar: RnuiSnackbarOnShowFn,
}

const RnuiSnackbarContext = createContext<RnuiSnackbarContextT | undefined>(undefined);

export type RnuiSnackbarProviderPropsT = {
  children: ReactElement | ReactElement[],
};

export const RnuiSnackbarProvider: React.FC<RnuiSnackbarProviderPropsT> = ({ children }) => {
  const [snackbarMsgInfos, setSnackbarMsgInfos] = useState<RnuiSnackbarMessageInfoT[]>([]);

  const handleShowSnackbar = (snackbarMsgRequest: RnuiSnackbarMessageRequestT): void => {
    const nowTs = Date.now();
    const newSnackbarMsgInfo: RnuiSnackbarMessageInfoT = {
      uniqueKey: generateUuidv4(),
      message: snackbarMsgRequest.message,
      durationMs: snackbarMsgRequest.durationMs || RNUI_SNACKBAR_DEFAULT_DURATION_MS,
      withCloseButton: !!snackbarMsgRequest.withCloseButton,
      displayStartTs: nowTs,
      level: snackbarMsgRequest.level || "info",
    }

    setSnackbarMsgInfos(prev => [...prev, newSnackbarMsgInfo]);
  }

  const handleDismiss = (uniqueKey: string): void => {
    setSnackbarMsgInfos(prev => prev.filter((e) => e.uniqueKey !== uniqueKey));
  }

  return (
    <RnuiSnackbarContext.Provider value={{ onShowSnackbar: handleShowSnackbar }}>
      {children}

      {snackbarMsgInfos.map((e, index) =>
        <View key={e.uniqueKey}>
          <RnuiSnackbar testID="snackbar-tid" snackbarMsgInfo={e} index={index} onDismiss={handleDismiss} />
        </View>
      )}
    </RnuiSnackbarContext.Provider>
  );
};

export const useRnuiSnackbar = (): RnuiSnackbarContextT => useContext(RnuiSnackbarContext) as RnuiSnackbarContextT;
