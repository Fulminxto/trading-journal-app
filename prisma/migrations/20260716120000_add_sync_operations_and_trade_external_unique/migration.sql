-- CreateEnum
CREATE TYPE "SyncOperationStatus" AS ENUM ('STARTED', 'PROCESSING', 'COMPLETED', 'PARTIAL', 'FAILED', 'ABANDONED');

-- CreateTable
CREATE TABLE "SyncOperation" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "source" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "externalBatchId" TEXT NOT NULL,
    "status" "SyncOperationStatus" NOT NULL DEFAULT 'STARTED',
    "totalCount" INTEGER,
    "importedCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastItemAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyncOperation_accountId_startedAt_idx" ON "SyncOperation"("accountId", "startedAt");

-- CreateIndex
CREATE INDEX "SyncOperation_actorUserId_startedAt_idx" ON "SyncOperation"("actorUserId", "startedAt");

-- CreateIndex
CREATE INDEX "SyncOperation_status_startedAt_idx" ON "SyncOperation"("status", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SyncOperation_accountId_source_externalBatchId_key" ON "SyncOperation"("accountId", "source", "externalBatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_tradingAccountId_externalTradeId_key" ON "Trade"("tradingAccountId", "externalTradeId");

-- AddForeignKey
ALTER TABLE "SyncOperation" ADD CONSTRAINT "SyncOperation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncOperation" ADD CONSTRAINT "SyncOperation_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
