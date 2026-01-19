
import { RnuiProvider, type RnuiImageSourceT, type RnuiStylesT } from "@ig/rnui";
import React, { ReactElement } from 'react';
import { StyleSheet, View } from "react-native";
import { type MD3Theme } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";
import { AppErrorHandlingProvider } from "../error-handling/AppErrorHandlingProvider";
import { AppLocalizationProvider } from "../localization/AppLocalizationProvider";
import { createReduxStore } from "../model/reducers/AppReduxStore";
import AppConfigProvider from "./AppConfigProvider";
import { AppWebSocketProvider } from "./AppWebSocketProvider";

export type AppRootLayoutPropsT = {
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
  theme: MD3Theme,
  rnuiStyles: RnuiStylesT,
  gameUiConfig: GameUiConfigT,
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  children: ReactElement | ReactElement[],
};

export const AppRootLayout: React.FC<AppRootLayoutPropsT> = (props) => {
  const { imagesSourceMap, theme, rnuiStyles, gameUiConfig, gamesUiUrlPathsAdapter, children } = props;
  const reduxStore = createReduxStore(gameUiConfig);

  return (
    <RnuiProvider theme={theme} rnuiStyles={rnuiStyles}>
      <AppLocalizationProvider>
        {/* AppErrorHandlingProvider depends on RnuiProvider::RnuiSnackbarProvider and AppLocalizationProvider */}
        <AppErrorHandlingProvider>
          <AppConfigProvider
            imagesSourceMap={imagesSourceMap}
            gameUiConfig={gameUiConfig}
            gamesUiUrlPathsAdapter={gamesUiUrlPathsAdapter}
          >
            <ReduxProvider store={reduxStore}>
              {/* AppWebSocketProvider depends on AppConfigProvider and ReduxProvider */}
              <AppWebSocketProvider>
                <View style={styles.container} testID="game-layout-wrapper" >
                  {children}
                </View>
              </AppWebSocketProvider>
            </ReduxProvider>
          </AppConfigProvider>
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
