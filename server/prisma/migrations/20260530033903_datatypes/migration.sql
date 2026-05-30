/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BlacklistedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BlacklistedToken" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedToken_userId_key" ON "BlacklistedToken"("userId");
