
import { createContext, useContext, type FC, type PropsWithChildren } from 'react';

export interface ChatContextT {
  chatUpdateNotificationTopicPrefix: string,
}

export type ChatProviderPropsT = {
  chatUpdateNotificationTopicPrefix: string,
}

const ChatContext = createContext<ChatContextT | undefined>(undefined);

export const ChatProvider: FC<PropsWithChildren<ChatProviderPropsT>> = (props) => {
  const { chatUpdateNotificationTopicPrefix, children } = props;

  const context: ChatContextT = {
    chatUpdateNotificationTopicPrefix: chatUpdateNotificationTopicPrefix,
  }

  return (
    <ChatContext.Provider value={context}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = (): ChatContextT => useContext(ChatContext) as ChatContextT;
