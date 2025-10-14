/*
  Warnings:

  - Added the required column `name` to the `QuestionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionGroup" ADD COLUMN     "name" TEXT NOT NULL;
