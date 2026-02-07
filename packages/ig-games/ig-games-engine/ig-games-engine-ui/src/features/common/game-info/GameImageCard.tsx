
import { useAppConfig } from '@ig/app-engine-ui';
import type { MinimalGameInfoT } from '@ig/games-engine-models';
import { RnuiCard, type RnuiImagePropsT } from '@ig/rnui';
import React, { type FC, type PropsWithChildren } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { getMinimalGameConfigImageProps } from '../../../utils/GameViewUtils';

export type GameImageCardPropsT = TestableComponentT & {
  minimalGameInfo: MinimalGameInfoT,
  includeFreeLabel?: boolean,
};

export const GameImageCard: FC<PropsWithChildren<GameImageCardPropsT>> = (props) => {
  const { minimalGameInfo, includeFreeLabel, children } = props;
  const { imagesSourceMap } = useAppConfig();
  const rnuiImageProps: RnuiImagePropsT | undefined =
    getMinimalGameConfigImageProps(minimalGameInfo, imagesSourceMap, includeFreeLabel);

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
