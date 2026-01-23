
import { useGenericStyles } from '@ig/engine-app-ui';
import type { MinimalGameInstanceExposedInfoT } from '@ig/engine-models';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameInstanceSummaryView } from './GameInstanceSummaryView';
import { OpenGameInstanceButtonLink } from './OpenGameInstanceButtonLink';

export type GameInstanceViewPropsT = TestableComponentT & {
  minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT,
};

export const GameInstanceView: FC<GameInstanceViewPropsT> = (props) => {
  const { minimalGameInstanceExposedInfo } = props;
  const genericStyles = useGenericStyles();

  return (
    <View style={genericStyles.verticalSpacing}>
      <GameInstanceSummaryView
        testID='GameInstanceSummaryView-tid'
        minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo}
      />

      <View style={genericStyles.flexRowReverse}>
        <OpenGameInstanceButtonLink
          testID='OpenGameInstanceButtonLink-tid'
          gameInstanceId={minimalGameInstanceExposedInfo.gameInstanceId}
        />
      </View>
    </View>
  )
};
