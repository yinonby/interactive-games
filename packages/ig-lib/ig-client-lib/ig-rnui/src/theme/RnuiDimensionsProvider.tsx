
import { useWindowDimensions } from 'react-native';

export type RnuiDimensionsT = {
  width: number,
  height: number,
}

export const useRnuiDimensions = (): RnuiDimensionsT => {
  const { width, height } = useWindowDimensions();
  return { width, height };
}
