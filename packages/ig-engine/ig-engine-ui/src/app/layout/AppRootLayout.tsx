
import type { AppImageAssetT } from '@ig/engine-models';
import { RnuiProvider, type RnuiImageSourceT, type RnuiStylesT } from "@ig/rnui";
import React, { ReactElement } from 'react';
import { StyleSheet, View } from "react-native";
import { type MD3Theme } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";
import { AppErrorHandlingProvider } from "../error-handling/AppErrorHandlingProvider";
import { AppLocalizationProvider } from "../localization/AppLocalizationProvider";
import { createReduxStore } from "../model/reducers/AppReduxStore";
import { AppConfigProvider } from "./AppConfigProvider";
import { AppWebSocketProvider, type AppWebSocketMsgHandlerT } from "./AppWebSocketProvider";

export type AppRootLayoutPropsT = {
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  theme: MD3Theme,
  rnuiStyles: RnuiStylesT,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  appWebSocketMsgHandlers: AppWebSocketMsgHandlerT[],
  children: ReactElement | ReactElement[],
};

export const AppRootLayout: React.FC<AppRootLayoutPropsT> = (props) => {
  const {
    imagesSourceMap, theme, rnuiStyles, gameUiConfig, gamesUiUrlPathsAdapter,
    appWebSocketMsgHandlers, children
  } = props;
  const reduxStore = createReduxStore(gameUiConfig);

  return (
    <RnuiProvider theme={theme} rnuiStyles={rnuiStyles}>
      <AppLocalizationProvider>
        {/* AppErrorHandlingProvider depends on RnuiProvider::RnuiSnackbarProvider and AppLocalizationProvider */}
        <AppErrorHandlingProvider testID='AppErrorHandlingProvider-tid'>
          <ReduxProvider store={reduxStore}>
            <AppConfigProvider
              imagesSourceMap={imagesSourceMap}
              gameUiConfig={gameUiConfig}
              gamesUiUrlPathsAdapter={gamesUiUrlPathsAdapter}
            >
              {/* AppWebSocketProvider depends on AppConfigProvider and ReduxProvider */}
              <AppWebSocketProvider appWebSocketMsgHandlers={appWebSocketMsgHandlers}>
                <View style={styles.container} testID="gameLayoutWrapper-tid" >
                  {children}
                </View>
              </AppWebSocketProvider>
            </AppConfigProvider>
          </ReduxProvider>
        </AppErrorHandlingProvider>
      </AppLocalizationProvider>
    </RnuiProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
