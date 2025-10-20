/*
  Warnings:

  - Added the required column `scheduledDateTime` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "notifyBeforeStartMinutes" INTEGER,
ADD COLUMN     "passingScore" INTEGER,
ADD COLUMN     "scheduledDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeLimit" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
