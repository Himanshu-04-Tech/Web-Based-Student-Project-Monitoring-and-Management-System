/*
  Warnings:

  - You are about to drop the column `groupId` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `StudentGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `StudentGroup` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,groupId]` on the table `StudentGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `StudentGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_groupId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_studentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_pkey",
DROP COLUMN "studentId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupId";

-- CreateIndex
CREATE UNIQUE INDEX "StudentGroup_userId_groupId_key" ON "StudentGroup"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
