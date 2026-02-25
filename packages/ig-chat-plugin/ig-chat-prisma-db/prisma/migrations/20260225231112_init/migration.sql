-- CreateTable
CREATE TABLE "ChatMessage" (
    "msgId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "conversationKind" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderDisplayName" TEXT NOT NULL,
    "msgContent" TEXT NOT NULL,
    "sentTs" DOUBLE PRECISION NOT NULL,
    "paginationId" SERIAL NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("msgId")
);

-- CreateIndex
CREATE INDEX "ChatMessage_msgId_idx" ON "ChatMessage"("msgId");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_paginationId_idx" ON "ChatMessage"("conversationId", "paginationId");
