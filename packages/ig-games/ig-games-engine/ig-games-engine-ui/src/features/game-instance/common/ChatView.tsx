
import { useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import { useAuth } from '@ig/auth-ui';
import {
  getGameInstanceConversationId,
  type ChatMessageT,
  type ConversationIdT,
  type GameInstanceExposedInfoT, type PlayerExposedInfoT
} from '@ig/games-engine-models';
import { RnuiIconButton, RnuiText, RnuiTextInput } from '@ig/rnui';
import React, { useRef, useState, type FC } from 'react';
import { FlatList, View } from 'react-native';
import {
  useGameInstanceController
} from '../../../domains/game-instance/controller/user-actions/GameInstanceController';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type ChatViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  chatMessages: ChatMessageT[],
};

export type ChatMessageWithPlayerNicknameT = ChatMessageT & {
  playerNickname: string,
}

const getChatMessagePlayerNickname = (
  chatMessage: ChatMessageT,
  playerExposedInfos: PlayerExposedInfoT[],
): string | null => {
  const otherPlayerExposedInfo: PlayerExposedInfoT | undefined =
    playerExposedInfos.find(e => e.playerAccountId === chatMessage.senderAccountId);
  if (otherPlayerExposedInfo === undefined) {
    return null;
  }
  return otherPlayerExposedInfo.playerNickname;
}

const getChatMessageWithPlayerNicknames = (
  chatMessages: ChatMessageT[],
  playerExposedInfos: PlayerExposedInfoT[],
): ChatMessageWithPlayerNicknameT[] => {
  const chatMessageWithPlayerNicknames: ChatMessageWithPlayerNicknameT[] = [];
  for (const chatMessage of chatMessages) {
    const playerNickname: string | null = getChatMessagePlayerNickname(chatMessage,
      playerExposedInfos);
    if (playerNickname !== null) {
      chatMessageWithPlayerNicknames.push({ ...chatMessage, playerNickname: playerNickname });
    }
  }
  return chatMessageWithPlayerNicknames;
}

export const ChatView: FC<ChatViewPropsT> = (props) => {
  const { gameInstanceExposedInfo, chatMessages } = props;
  const { onSendChatMessage } = useGameInstanceController();
  const { t } = useAppLocalization();
  const [chatMessage, setChatMessage] = useState("");
  const listRef = useRef<FlatList>(null);
  const genericStyles = useGenericStyles();
  const { curAccountId } = useAuth();
  const { onUnknownError } = useAppErrorHandling();

  const chatMessageWithPlayerNicknames: ChatMessageWithPlayerNicknameT[] =
    getChatMessageWithPlayerNicknames(chatMessages, gameInstanceExposedInfo.playerExposedInfos);

  const handlePress = async (): Promise<void> => {
    const conversationId: ConversationIdT = getGameInstanceConversationId(gameInstanceExposedInfo.gameInstanceId);

    try {
      await onSendChatMessage('gameInstanceChat', conversationId, curAccountId, chatMessage);
      setChatMessage("");
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <View style={genericStyles.spacing}>
      <RnuiText testID="chat-title-tid" variant="titleMedium">{t("common:chat")}</RnuiText>

      <View style={{ maxHeight: 200 }}>
        <FlatList<ChatMessageWithPlayerNicknameT>
          testID="FlatList-tid"
          ref={listRef}
          data={chatMessageWithPlayerNicknames}
          keyExtractor={(m, index) => index.toString()}
          renderItem={({ item }) =>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RnuiText variant="titleSmall">{item.playerNickname}: </RnuiText>
              <RnuiText>{item.msgText}</RnuiText>
            </View>}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
        <RnuiTextInput
          testID="RnuiTextInput-tid"
          submitBehavior="submit"
          style={genericStyles.flex1}
          value={chatMessage}
          onChangeText={setChatMessage}
          onSubmitEditing={handlePress}
        />
        <RnuiIconButton testID="send-msg-btn-tid" size="xs" icon="send" onPress={handlePress}/>
      </View>
    </View>
  );
};
