-- CreateEnum
CREATE TYPE "SyncOperationItemStatus" AS ENUM ('PROCESSING', 'CREATED', 'UPDATED', 'SKIPPED', 'FAILED');

-- CreateTable
CREATE TABLE "SyncOperationItem" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "status" "SyncOperationItemStatus" NOT NULL DEFAULT 'PROCESSING',
    "tradeId" INTEGER,
    "needsReview" BOOLEAN,
    "syncStatus" TEXT,
    "changedFields" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "safeErrorCode" TEXT,
    "httpStatus" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncOperationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncOperationItem_operationId_itemKey_key" ON "SyncOperationItem"("operationId", "itemKey");

-- CreateIndex
CREATE INDEX "SyncOperationItem_operationId_status_idx" ON "SyncOperationItem"("operationId", "status");

-- CreateIndex
CREATE INDEX "SyncOperationItem_tradeId_idx" ON "SyncOperationItem"("tradeId");

-- AddForeignKey
ALTER TABLE "SyncOperationItem" ADD CONSTRAINT "SyncOperationItem_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "SyncOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncOperationItem" ADD CONSTRAINT "SyncOperationItem_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
