
import { useAppConfig, useAppLocalization, useGenericStyles } from "@ig/engine-app-ui";
import type {
  GameInstanceChatMessageT,
  GameInstanceExposedInfoT, PlayerExposedInfoT
} from "@ig/engine-models";
import { RnuiIconButton, RnuiText, RnuiTextInput } from "@ig/rnui";
import React, { useRef, useState, type FC } from 'react';
import { FlatList, View } from 'react-native';
import {
  useGameInstanceController
} from "../../../domains/game-instance/controller/user-actions/GameInstanceController";
import type { TestableComponentT } from "../../../types/ComponentTypes";

export type ChatViewPropsT = TestableComponentT & {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  gameInstanceChatMessages: GameInstanceChatMessageT[],
};

export type ChatMessageWithPlayerNicknameT = GameInstanceChatMessageT & {
  playerNickname: string,
}

const getChatMessagePlayerNickname = (
  gameInstanceChatMessage: GameInstanceChatMessageT,
  playerExposedInfos: PlayerExposedInfoT[],
): string | null => {
  const otherPlayerExposedInfo: PlayerExposedInfoT | undefined =
    playerExposedInfos.find(e => e.playerUserId === gameInstanceChatMessage.playerUserId);
  if (otherPlayerExposedInfo === undefined) {
    return null;
  }
  return otherPlayerExposedInfo.playerNickname;
}

const getChatMessageWithPlayerNicknames = (
  gameInstanceChatMessages: GameInstanceChatMessageT[],
  playerExposedInfos: PlayerExposedInfoT[],
): ChatMessageWithPlayerNicknameT[] => {
  const chatMessageWithPlayerNicknames: ChatMessageWithPlayerNicknameT[] = [];
  for (const gameInstanceChatMessage of gameInstanceChatMessages) {
    const playerNickname: string | null = getChatMessagePlayerNickname(gameInstanceChatMessage,
      playerExposedInfos);
    if (playerNickname !== null) {
      chatMessageWithPlayerNicknames.push({ ...gameInstanceChatMessage, playerNickname: playerNickname });
    }
  }
  return chatMessageWithPlayerNicknames;
}

export const ChatView: FC<ChatViewPropsT> = (props) => {
  const { gameInstanceExposedInfo, gameInstanceChatMessages } = props;
  const { onSendChatMessage } = useGameInstanceController();
  const { t } = useAppLocalization();
  const [chatMessage, setChatMessage] = useState("");
  const listRef = useRef<FlatList>(null);
  const genericStyles = useGenericStyles();
  const { curUserId } = useAppConfig();

  const chatMessageWithPlayerNicknames: ChatMessageWithPlayerNicknameT[] =
    getChatMessageWithPlayerNicknames(gameInstanceChatMessages, gameInstanceExposedInfo.playerExposedInfos);

  const handlePress = async (): Promise<void> => {
    await onSendChatMessage(gameInstanceExposedInfo.gameInstanceId, curUserId, chatMessage);
    setChatMessage("");
  }

  return (
    <View style={genericStyles.verticalSpacing}>
      <RnuiText testID="chat-title-tid" variant="titleMedium">{t("common:chat")}</RnuiText>

      <View style={{ maxHeight: 200 }}>
        <FlatList<ChatMessageWithPlayerNicknameT>
          testID="chat-msg-list-tid"
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
          testID="new-msg-input-tid"
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
