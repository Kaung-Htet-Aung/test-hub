/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GroupParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GroupTest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."GroupParticipant" DROP CONSTRAINT "GroupParticipant_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupParticipant" DROP CONSTRAINT "GroupParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupTest" DROP CONSTRAINT "GroupTest_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupTest" DROP CONSTRAINT "GroupTest_testId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Test" DROP CONSTRAINT "Test_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestAssignment" DROP CONSTRAINT "TestAssignment_testId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestAssignment" DROP CONSTRAINT "TestAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestAttempt" DROP CONSTRAINT "TestAttempt_testId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestAttempt" DROP CONSTRAINT "TestAttempt_userId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Group_id_seq";

-- AlterTable
ALTER TABLE "GroupParticipant" DROP CONSTRAINT "GroupParticipant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "groupId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "GroupParticipant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GroupParticipant_id_seq";

-- AlterTable
ALTER TABLE "GroupTest" DROP CONSTRAINT "GroupTest_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "groupId" SET DATA TYPE TEXT,
ALTER COLUMN "testId" SET DATA TYPE TEXT,
ADD CONSTRAINT "GroupTest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GroupTest_id_seq";

-- AlterTable
ALTER TABLE "Test" DROP CONSTRAINT "Test_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Test_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Test_id_seq";

-- AlterTable
ALTER TABLE "TestAssignment" DROP CONSTRAINT "TestAssignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "testId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestAssignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestAssignment_id_seq";

-- AlterTable
ALTER TABLE "TestAttempt" DROP CONSTRAINT "TestAttempt_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "testId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestAttempt_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupParticipant" ADD CONSTRAINT "GroupParticipant_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupParticipant" ADD CONSTRAINT "GroupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTest" ADD CONSTRAINT "GroupTest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTest" ADD CONSTRAINT "GroupTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
