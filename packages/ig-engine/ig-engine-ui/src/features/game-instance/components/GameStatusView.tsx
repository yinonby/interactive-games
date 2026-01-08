
import { RnuiBlinker } from "@ig/rnui";
import { type FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TestableComponentT } from "../../../types/ComponentTypes";

export type GameStatusViewPropsT = TestableComponentT &{
  gameStatus: 'not-started' | 'in-process' | 'ended';
};

export const GameStatusView: FC<GameStatusViewPropsT> = ({ gameStatus }) => {
  // Determine status color and text
  let statusColor = 'red';
  let statusText = 'Game ended';

  if (gameStatus === 'not-started') {
    statusColor = 'orange';
    statusText = 'Game not started';
  } else if (gameStatus === 'in-process') {
    statusColor = 'green';
    statusText = 'Game in process';
  }

  return (
    <View
      testID="status-view"
      style={styles.statusContainer}
    >
      {gameStatus === "in-process" && <RnuiBlinker testID="blinker" color="green" durationMs={1000} />}
      {gameStatus !== "in-process" &&
        <View
        testID="status-circle"
        style={[
            styles.statusCircle,
            { backgroundColor: statusColor },
          ]}
        />
      }
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
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
