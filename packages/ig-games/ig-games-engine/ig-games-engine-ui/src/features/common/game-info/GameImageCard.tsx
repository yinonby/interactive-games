
import { useAppConfig } from '@ig/app-engine-ui';
import type { MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { RnuiCard, type RnuiImagePropsT } from '@ig/rnui';
import React, { type FC, type PropsWithChildren } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { getGameConfigImageProps } from '../../../utils/GameViewUtils';

export type GameImageCardPropsT = TestableComponentT & {
  minimalPublicGameConfig: MinimalPublicGameConfigT,
  includeFreeLabel?: boolean,
};

export const GameImageCard: FC<PropsWithChildren<GameImageCardPropsT>> = (props) => {
  const { minimalPublicGameConfig, includeFreeLabel, children } = props;
  const { imagesSourceMap } = useAppConfig();
  const rnuiImageProps: RnuiImagePropsT | undefined =
    getGameConfigImageProps(minimalPublicGameConfig, imagesSourceMap, includeFreeLabel);

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
