
import { useAppConfig } from "@ig/engine-app-ui";
import type { GameInstanceChatMessageT, GameInstanceExposedInfoT } from "@ig/engine-models";
import { RnuiCard, RnuiGrid, RnuiGridItem, type RnuiImagePropsT } from "@ig/rnui";
import React, { type FC } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TestableComponentT } from "../../../types/ComponentTypes";
import { getMinimalGameConfigImageProps } from "../../../utils/GameViewUtils";
import { ChatView } from "./ChatView";
import { GameInstanceSummaryView } from "./GameInstanceSummaryView";
import { InviteView } from "./InviteView";
import { PlayersView } from "./PlayersView";

export type GameInstanceViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  gameInstanceChatMessages: GameInstanceChatMessageT[],
};

export const GameInstanceView: FC<GameInstanceViewPropsT> = ({ gameInstanceExposedInfo, gameInstanceChatMessages }) => {
  const { playerRole } = gameInstanceExposedInfo;
  const { imagesSourceMap } = useAppConfig();
  const gameConfig = gameInstanceExposedInfo.gameConfig;
  const rnuiImageProps: RnuiImagePropsT | undefined = getMinimalGameConfigImageProps(gameConfig, imagesSourceMap);
  const isPlayerAdmin = playerRole === "admin";

  return (
    <View style={styles.container}>
      <RnuiGrid>
        <RnuiGridItem key="summary" xs={12} sm={12} md={5} lg={3} xl={2} >
          <RnuiCard
            height={"100%"}
            imageProps={rnuiImageProps}
          >
            <GameInstanceSummaryView
              testID="game-instance-summary-view-tid"
              gameInstanceExposedInfo={gameInstanceExposedInfo}
            />
          </RnuiCard>
        </RnuiGridItem>

        <RnuiGridItem key="players" xs={12} sm={12} md={7} lg={9} xl={5} >
          {isPlayerAdmin &&
            <View style={styles.spacingBottom}>
              <RnuiCard>
                <InviteView testID="invite-view-tid" gameInstanceExposedInfo={gameInstanceExposedInfo} />
              </RnuiCard>
            </View>
          }
          <RnuiCard >
            <PlayersView testID="players-view-tid" gameInstanceExposedInfo={gameInstanceExposedInfo} />
          </RnuiCard>
        </RnuiGridItem>

        <RnuiGridItem key="chat" xs={12} sm={12} md={12} lg={12} xl={5} >
          <RnuiCard >
            <ChatView
              testID="chat-view-tid"
              gameInstanceExposedInfo={gameInstanceExposedInfo}
              gameInstanceChatMessages={gameInstanceChatMessages}
            />
          </RnuiCard>
        </RnuiGridItem>
      </RnuiGrid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  spacingBottom: {
    marginBottom: 8,
  },
  spacingEnd: {
    marginEnd: 8,
  },
  flex1: {
    flex: 1,
  },
});
