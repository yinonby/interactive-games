
import { useClientLogger, useGenericStyles } from '@ig/app-engine-ui';
import { useAuth } from '@ig/auth-ui';
import { ChatView } from '@ig/chat-ui';
import { getGameInstanceConversationId, type PublicGameInstanceT } from '@ig/games-engine-models';
import { RnuiCard, RnuiGrid, RnuiGridItem } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import type { TestableComponentT } from '../../../../types/ComponentTypes';
import { GameImageCard } from '../../../common/game-info/GameImageCard';
import { GameInstanceConfigSummaryView } from './GameInstanceConfigSummaryView';
import { InviteView } from './InviteView';
import { LevelsView } from './LevelsView';
import { PlayersView } from './PlayersView';

export type GameInstanceViewPropsT = TestableComponentT & {
  publicGameInstance: PublicGameInstanceT,
};

export const GameInstanceView: FC<GameInstanceViewPropsT> = (props) => {
  const { publicGameInstance } = props;
  const { publicPlayerInfos } = publicGameInstance;
  const { curAccountId } = useAuth();
  const publicGameConfig = publicGameInstance.publicGameConfig;
  const logger = useClientLogger();
  const genericStyles = useGenericStyles();

  const curPublicPlayerInfo = publicPlayerInfos.find(e => e.playerId === curAccountId);
  if (curPublicPlayerInfo === undefined) {
    logger.error(`Unexpected game instance not belonging to player,` +
      `gameInstanceId [${publicGameInstance.gameInstanceId}] curAccountId [${curAccountId}]`);
    return null;
  }

  const isCurUserAdminPlayer = curPublicPlayerInfo.playerRole === "admin";

  return (
    <View testID='container-tid'>
      <RnuiGrid>
        <RnuiGridItem key="invite" xs={12} sm={12} md={12} lg={12} xl={12} >
          {isCurUserAdminPlayer &&
            <RnuiCard>
              <InviteView testID="InviteView-tid" publicGameInstance={publicGameInstance} />
            </RnuiCard>
          }
        </RnuiGridItem>

        <RnuiGridItem key="summary" xs={12} sm={12} md={12} lg={6} xl={6} >
          <View>
            <GameImageCard testID='GameImageCard-tid' minimalPublicGameConfig={publicGameConfig} includeFreeLabel={false}>
              <View style={genericStyles.spacing}>
                <GameInstanceConfigSummaryView
                  testID="GameInstanceConfigSummaryView-tid"
                  publicGameInstance={publicGameInstance}
                />

                {publicGameInstance.gameState.gameStatus !== 'notStarted' &&
                  <LevelsView
                    testID='LevelsView-tid'
                    publicGameInstance={publicGameInstance}
                  />
                }
            </View>
            </GameImageCard>
          </View>
        </RnuiGridItem>

        <RnuiGridItem key="players" xs={12} sm={12} md={12} lg={6} xl={6} >
          <View style={genericStyles.spacing}>
            <RnuiCard >
              <PlayersView
                testID="PlayersView-tid"
                publicGameInstance={publicGameInstance}
                withAdminButtons
              />
            </RnuiCard>

            <RnuiCard >
              <ChatView
                testID="ChatView-tid"
                conversationId={getGameInstanceConversationId(publicGameInstance.gameInstanceId)}
                senderId={curAccountId}
                senderDisplayName={curPublicPlayerInfo.playerNickname}
              />
            </RnuiCard>
          </View>
        </RnuiGridItem>
      </RnuiGrid>
    </View>
  );
};
