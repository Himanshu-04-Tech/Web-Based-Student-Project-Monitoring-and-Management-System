/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinCode` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `purpose` on the `Group` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "joinCode" TEXT NOT NULL,
DROP COLUMN "purpose",
ADD COLUMN     "purpose" "ProjectType" NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "groupId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Group_joinCode_key" ON "Group"("joinCode");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
