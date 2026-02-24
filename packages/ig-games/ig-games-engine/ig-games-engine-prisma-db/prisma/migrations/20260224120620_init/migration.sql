-- CreateEnum
CREATE TYPE "ConversationKind" AS ENUM ('gameInstanceChat');

-- CreateTable
CREATE TABLE "GameChatMessage" (
    "conversationKind" "ConversationKind" NOT NULL,
    "conversationId" TEXT NOT NULL,
    "chatMsgId" TEXT NOT NULL,
    "senderAccountId" TEXT NOT NULL,
    "sentTs" INTEGER NOT NULL,
    "msgText" TEXT NOT NULL,
    "paginationId" SERIAL NOT NULL,

    CONSTRAINT "GameChatMessage_pkey" PRIMARY KEY ("chatMsgId")
);

-- CreateIndex
CREATE INDEX "GameChatMessage_chatMsgId_idx" ON "GameChatMessage"("chatMsgId");

-- CreateIndex
CREATE INDEX "GameChatMessage_conversationId_paginationId_idx" ON "GameChatMessage"("conversationId", "paginationId");
