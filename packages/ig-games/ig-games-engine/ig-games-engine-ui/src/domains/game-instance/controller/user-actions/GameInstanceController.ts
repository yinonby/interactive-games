
import type { AccountIdT } from '@ig/app-engine-models';
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { ConversationIdT, GameInstanceIdT } from '@ig/games-engine-models';
import {
  usePostChatMessageMutation,
  useStartGameMutation, useSubmitGuessMutation
} from '../../model/rtk/GameInstanceRtkApi';

export type GameInstanceControllerT = {
  onStartGame: (gameInstanceId: GameInstanceIdT) => Promise<void>,

  onSendChatMessage: (
    conversationKind: 'gameInstanceChat',
    conversationId: ConversationIdT,
    senderAccountId: AccountIdT,
    chatMessage: string,
  ) => Promise<void>,

  onSubmitGuess: (gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string) => Promise<boolean>,
}

export function useGameInstanceController(): GameInstanceControllerT {
  const [
    postChatMessage,
  ] = usePostChatMessageMutation();
  const [
    startGame,
  ] = useStartGameMutation();
  const [ submitGuess ] = useSubmitGuessMutation();

  async function handleStartGame(gameInstanceId: GameInstanceIdT): Promise<void> {
    const { error } = await startGame(gameInstanceId);
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  }

  async function handleSubmitGuess(gameInstanceId: GameInstanceIdT, levelIdx: number, guess: string): Promise<boolean> {
    const { error, data } = await submitGuess({gameInstanceId, levelIdx, guess});
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.isGuessCorrect;
  }

  const sendChatMessge = async (
    conversationKind: 'gameInstanceChat',
    conversationId: ConversationIdT,
    senderAccountId: AccountIdT,
    chatMessage: string
  ): Promise<void> => {
    const { error } = await postChatMessage({
      conversationKind: conversationKind,
      conversationId: conversationId,
      senderAccountId: senderAccountId,
      chatMessage: chatMessage,
    });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  };

  return {
    onStartGame: handleStartGame,
    onSendChatMessage: sendChatMessge,
    onSubmitGuess: handleSubmitGuess,
  }
}
