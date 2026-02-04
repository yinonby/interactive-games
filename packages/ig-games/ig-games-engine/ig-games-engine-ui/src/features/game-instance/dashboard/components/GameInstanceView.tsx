
import { useClientLogger, useGenericStyles } from '@ig/app-engine-ui';
import { useAuth } from '@ig/auth-ui';
import type { GameInstanceChatMessageT, GameInstanceExposedInfoT } from '@ig/games-engine-models';
import { RnuiCard, RnuiGrid, RnuiGridItem } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../../types/ComponentTypes';
import { GameImageCard } from '../../../common/game-config/GameImageCard';
import { ChatView } from '../../common/ChatView';
import { GameInstanceConfigSummaryView } from './GameInstanceConfigSummaryView';
import { InviteView } from './InviteView';
import { PlayersView } from './PlayersView';

export type GameInstanceViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  gameInstanceChatMessages: GameInstanceChatMessageT[],
};

export const GameInstanceView: FC<GameInstanceViewPropsT> = (props) => {
  const { gameInstanceExposedInfo, gameInstanceChatMessages } = props;
  const { playerExposedInfos } = gameInstanceExposedInfo;
  const { curUserId } = useAuth();
  const gameConfig = gameInstanceExposedInfo.gameConfig;
  const logger = useClientLogger();
  const genericStyles = useGenericStyles();

  const curPlayerExposedInfo = playerExposedInfos.find(e => e.playerUserId === curUserId);
  if (curPlayerExposedInfo === undefined) {
    logger.error(`Unexpected game instance not belonging to player,` +
      `gameInstanceId [${gameInstanceExposedInfo.gameInstanceId}] curUserId [${curUserId}]`);
    return null;
  }

  const isCurUserAdminPlayer = curPlayerExposedInfo.playerRole === "admin";

  return (
    <View testID='container-tid'>
      <RnuiGrid>
        <RnuiGridItem key="summary" xs={12} sm={12} md={12} lg={3} xl={4} >
          <View>
            <GameImageCard testID='GameImageCard-tid' minimalGameConfig={gameConfig} includeFreeLabel={false}>
              <GameInstanceConfigSummaryView
                testID="GameInstanceConfigSummaryView-tid"
                gameInstanceExposedInfo={gameInstanceExposedInfo}
              />
            </GameImageCard>
          </View>
        </RnuiGridItem>

        <RnuiGridItem key="players" xs={12} sm={12} md={12} lg={9} xl={8} >
          <View style={genericStyles.verticalSpacing}>
            {isCurUserAdminPlayer &&
              <View>
                <RnuiCard>
                  <InviteView testID="InviteView-tid" gameInstanceExposedInfo={gameInstanceExposedInfo} />
                </RnuiCard>
              </View>
            }

            <RnuiCard >
              <PlayersView
                testID="PlayersView-tid"
                gameInstanceExposedInfo={gameInstanceExposedInfo}
                withAdminButtons
              />
            </RnuiCard>

            <RnuiCard >
              <ChatView
                testID="ChatView-tid"
                gameInstanceExposedInfo={gameInstanceExposedInfo}
                gameInstanceChatMessages={gameInstanceChatMessages}
              />
            </RnuiCard>
          </View>
        </RnuiGridItem>
      </RnuiGrid>
    </View>
  );
};
