

import { type FC } from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native-paper';

export type RnuiActivityIndicatorPropsT = ActivityIndicatorProps;

export const RnuiActivityIndicator: FC<RnuiActivityIndicatorPropsT> = (props) => {
  return (
    <ActivityIndicator testID="activity-indicator-tid" {...props} />
  );
};
