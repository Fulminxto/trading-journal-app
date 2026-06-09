-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyAccountActivity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyPlatformUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifySupport" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyTradeActivity" BOOLEAN NOT NULL DEFAULT true;
