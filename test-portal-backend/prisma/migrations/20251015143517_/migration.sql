/*
  Warnings:

  - You are about to drop the column `createdById` on the `Test` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_createdById_fkey";

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "createdById";
