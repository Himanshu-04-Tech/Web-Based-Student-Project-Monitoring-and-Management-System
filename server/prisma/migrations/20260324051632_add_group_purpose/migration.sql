/*
  Warnings:

  - Added the required column `purpose` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('COURSE_PROJECT', 'EDI');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "purpose" TEXT NOT NULL;
