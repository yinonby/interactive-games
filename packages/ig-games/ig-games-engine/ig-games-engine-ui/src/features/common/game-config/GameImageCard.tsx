
import { useAppConfig } from '@ig/app-engine-ui';
import type { MinimalGameConfigT } from '@ig/games-engine-models';
import { RnuiCard, type RnuiImagePropsT } from '@ig/rnui';
import React, { type FC, type PropsWithChildren } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { getMinimalGameConfigImageProps } from '../../../utils/GameViewUtils';

export type GameImageCardPropsT = TestableComponentT & {
  minimalGameConfig: MinimalGameConfigT,
  includeFreeLabel?: boolean,
};

export const GameImageCard: FC<PropsWithChildren<GameImageCardPropsT>> = (props) => {
  const { minimalGameConfig, includeFreeLabel, children } = props;
  const { imagesSourceMap } = useAppConfig();
  const rnuiImageProps: RnuiImagePropsT | undefined =
    getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap, includeFreeLabel);

  return (
    <RnuiCard
      testID='RnuiCard-tid'
      height={"100%"}
      imageProps={rnuiImageProps}
    >
      {children}
    </RnuiCard>
  );
};
