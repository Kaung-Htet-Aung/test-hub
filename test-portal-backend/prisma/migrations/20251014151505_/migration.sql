/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupTest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupParticipant" DROP CONSTRAINT "GroupParticipant_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupParticipant" DROP CONSTRAINT "GroupParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupTest" DROP CONSTRAINT "GroupTest_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupTest" DROP CONSTRAINT "GroupTest_testId_fkey";

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "groupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "GroupParticipant";

-- DropTable
DROP TABLE "GroupTest";

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchParticipant" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchTest" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "BatchTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BatchParticipant_groupId_userId_key" ON "BatchParticipant"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BatchTest_groupId_testId_key" ON "BatchTest"("groupId", "testId");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "QuestionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchParticipant" ADD CONSTRAINT "BatchParticipant_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchParticipant" ADD CONSTRAINT "BatchParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTest" ADD CONSTRAINT "BatchTest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTest" ADD CONSTRAINT "BatchTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "QuestionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
