
import { useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import {
  type ChatConversationIdT,
  type ChatMessageT,
  type ChatMsgSenderIdT,
} from '@ig/chat-models';
import {
  RnuiActivityIndicator, RnuiIconButton,
  RnuiText, RnuiTextInput, type TestableComponentT
} from '@ig/rnui';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { FlatList, View } from 'react-native';
import {
  useChatController
} from '../../domains/chat/controller/user-actions/ChatController';
import { useChatModel } from '../../domains/chat/model/rtk/ChatModel';
import { ChatSyncProvider } from './ChatSyncProvider';

export type ChatViewPropsT = TestableComponentT & {
  conversationId: ChatConversationIdT,
  senderId: ChatMsgSenderIdT,
  senderDisplayName: string,
};

export type ChatMessageWithPlayerNicknameT = ChatMessageT & {
  playerNickname: string,
}

export const ChatView: FC<ChatViewPropsT> = (props) => {
  const { senderId, conversationId, senderDisplayName } = props;
  const { onSendChatMessage } = useChatController();
  const {
    isLoading,
    isError,
    appErrCode,
    data: chatModelData
  } = useChatModel(conversationId);
  const { t } = useAppLocalization();
  const [msgContent, setMsgContent] = useState("");
  const listRef = useRef<FlatList>(null);
  const genericStyles = useGenericStyles();
  const { onUnknownError } = useAppErrorHandling();
  const { onAppError } = useAppErrorHandling();

  const handlePress = async (): Promise<void> => {
    try {
      await onSendChatMessage(conversationId, 'gameInstanceChat', senderId, senderDisplayName, msgContent);
      setMsgContent("");
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  useEffect(() => {
    if (isError) {
      onAppError(appErrCode);
    }
  }, [isError, onAppError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="RnuiActivityIndicator-tid" size="large" />;
  if (isError) {
    return null;
  }

  return (
    <ChatSyncProvider conversationId={conversationId}>
      <View style={genericStyles.spacing}>
        <RnuiText testID="chat-title-tid" variant="titleMedium">{t("common:chat")}</RnuiText>

        <View style={{ maxHeight: 200 }}>
          <FlatList<ChatMessageT>
            testID="FlatList-tid"
            ref={listRef}
            data={chatModelData.chatMessages}
            keyExtractor={(m, index) => index.toString()}
            renderItem={({ item }) =>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RnuiText variant="titleSmall">{item.senderDisplayName}: </RnuiText>
                <RnuiText>{item.msgContent}</RnuiText>
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
            value={msgContent}
            onChangeText={setMsgContent}
            onSubmitEditing={handlePress}
          />
          <RnuiIconButton testID="send-msg-btn-tid" size="xs" icon="send" onPress={handlePress}/>
        </View>
      </View>
    </ChatSyncProvider>
  );
};
