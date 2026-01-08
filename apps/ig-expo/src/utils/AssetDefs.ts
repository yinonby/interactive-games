
import type { GameImageTypeT } from "@ig/engine-ui";
import type { RnuiImageSourceT } from "@ig/rnui";
import { type ColorSchemeName, useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";
import type { MD3Colors } from "react-native-paper/lib/typescript/types";
import darkThemeJson from "../../assets/theme/darkTheme.json";
import lightThemeJson from "../../assets/theme/lightTheme.json";

export const useImageAssetDefs = (): Record<GameImageTypeT, RnuiImageSourceT> => {
  return {
    "treasure-hunt-1": require("../../assets/images/games/treasure-island-1.jpg"),
    "escape-room-1": require("../../assets/images/games/escape-room-1.jpg"),
  }
}

export const useGameTheme = (): MD3Theme => {
  const colorSchemeName: ColorSchemeName = useColorScheme();
  const theme: MD3Theme = colorSchemeName === "light" ? MD3LightTheme : MD3DarkTheme;
  const overrideThemeColors: MD3Colors | undefined = colorSchemeName === "light" ?
    lightThemeJson.colors : darkThemeJson.colors;
  const overrideTheme: MD3Theme = {
    ...theme,
    roundness: 8,
    colors: {
      ...theme.colors,
      ...overrideThemeColors,
    },
  }

  return overrideTheme;
}
