
import { useAppLocalization } from '@ig/app-engine-ui';
import { RnuiBlinker } from '@ig/rnui';
import { type FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type GameStatusViewPropsT = TestableComponentT &{
  gameStatus: 'notStarted' | 'inProcess' | 'ended';
};

export const GameStatusView: FC<GameStatusViewPropsT> = ({ gameStatus }) => {
  // Determine status color and text
  let statusColor = 'red';

  if (gameStatus === 'notStarted') {
    statusColor = 'orange';
  } else if (gameStatus === 'inProcess') {
    statusColor = 'green';
  }

  return (
    <View
      testID="status-view"
      style={styles.statusContainer}
    >
      {gameStatus === "inProcess" && <RnuiBlinker testID="blinker" color="green" durationMs={1000} />}
      {gameStatus !== "inProcess" &&
        <View
        testID="status-circle"
        style={[
            styles.statusCircle,
            { backgroundColor: statusColor },
          ]}
        />
      }
      <GameStatusText gameStatus={gameStatus}/>
    </View>
  );
};

const GameStatusText: FC<GameStatusViewPropsT> = ({ gameStatus }) => {
  const { t } = useAppLocalization();

  // Determine status color and text
  let statusText = t("games:gameEnded");

  if (gameStatus === 'notStarted') {
    statusText = t("games:gameNotStarted");
  } else if (gameStatus === 'inProcess') {
    statusText = t("games:gameInProcess");
  }

  return <Text style={styles.statusText}>{statusText}</Text>;
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
