/*
  Warnings:

  - You are about to drop the column `batchId` on the `Group` table. All the data in the column will be lost.
  - Added the required column `branch` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `division` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupNumber` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_batchId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "batchId",
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "division" TEXT NOT NULL,
ADD COLUMN     "groupNumber" TEXT NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL;
