/*
  Warnings:

  - You are about to drop the column `groupId` on the `BatchParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `BatchTest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[batchId,userId]` on the table `BatchParticipant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[batchId,testId]` on the table `BatchTest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batchId` to the `BatchParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batchId` to the `BatchTest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BatchParticipant" DROP CONSTRAINT "BatchParticipant_groupId_fkey";

-- DropForeignKey
ALTER TABLE "BatchTest" DROP CONSTRAINT "BatchTest_groupId_fkey";

-- DropIndex
DROP INDEX "BatchParticipant_groupId_userId_key";

-- DropIndex
DROP INDEX "BatchTest_groupId_testId_key";

-- AlterTable
ALTER TABLE "BatchParticipant" DROP COLUMN "groupId",
ADD COLUMN     "batchId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BatchTest" DROP COLUMN "groupId",
ADD COLUMN     "batchId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BatchParticipant_batchId_userId_key" ON "BatchParticipant"("batchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BatchTest_batchId_testId_key" ON "BatchTest"("batchId", "testId");

-- AddForeignKey
ALTER TABLE "BatchParticipant" ADD CONSTRAINT "BatchParticipant_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTest" ADD CONSTRAINT "BatchTest_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
