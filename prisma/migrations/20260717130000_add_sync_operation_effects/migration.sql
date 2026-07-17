-- CreateEnum
CREATE TYPE "SyncOperationEffectStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "SyncOperationEffect" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "effectKey" TEXT NOT NULL,
    "status" "SyncOperationEffectStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "safeErrorCode" TEXT,
    "notificationId" TEXT,
    "startedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncOperationEffect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncOperationEffect_notificationId_key" ON "SyncOperationEffect"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncOperationEffect_operationId_effectKey_key" ON "SyncOperationEffect"("operationId", "effectKey");

-- CreateIndex
CREATE INDEX "SyncOperationEffect_status_updatedAt_idx" ON "SyncOperationEffect"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "SyncOperationEffect_operationId_status_idx" ON "SyncOperationEffect"("operationId", "status");

-- AddForeignKey
ALTER TABLE "SyncOperationEffect" ADD CONSTRAINT "SyncOperationEffect_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "SyncOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncOperationEffect" ADD CONSTRAINT "SyncOperationEffect_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
