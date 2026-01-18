
import { RnuiProvider, type RnuiImageSourceT, type RnuiStylesT } from "@ig/rnui";
import React, { ReactElement } from 'react';
import { StyleSheet, View } from "react-native";
import { type MD3Theme } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import type { GameImageTypeT } from "../../types/GameImageTypes";
import type { GameUiConfigT, GameUiUrlPathsAdapter } from "../../types/GameUiConfigTypes";
import { AppLocalizationProvider } from "../localization/AppLocalizationProvider";
import { createReduxStore } from "../model/reducers/AppReduxStore";
import { AppWebSocketProvider } from "./AppWebSocketProvider";
import GameContextProvider from "./GameContextProvider";

export type GameLayoutPropsT = {
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
  theme: MD3Theme,
  rnuiStyles: RnuiStylesT,
  gameUiConfig: GameUiConfigT,
  gameUiUrlPathsAdapter: GameUiUrlPathsAdapter,
  children: ReactElement | ReactElement[],
};

export const GameLayout: React.FC<GameLayoutPropsT> = (props) => {
  const { imagesSourceMap, theme, rnuiStyles, gameUiConfig, gameUiUrlPathsAdapter, children } = props;
  const reduxStore = createReduxStore(gameUiConfig);

  return (
    <RnuiProvider theme={theme} rnuiStyles={rnuiStyles}>
      <AppLocalizationProvider>
        <GameContextProvider
          imagesSourceMap={imagesSourceMap}
          gameUiConfig={gameUiConfig}
          gameUiUrlPathsAdapter={gameUiUrlPathsAdapter}
        >
          <ReduxProvider store={reduxStore}>
            <AppWebSocketProvider> {/* AppWebSocketProvider depends on GameContextProvider and ReduxProvider */}
              <View style={styles.container} testID="game-layout-wrapper" >
                {children}
              </View>
            </AppWebSocketProvider>
          </ReduxProvider>
        </GameContextProvider>
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
