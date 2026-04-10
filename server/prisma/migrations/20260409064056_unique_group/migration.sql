/*
  Warnings:

  - A unique constraint covering the columns `[year,branch,division,groupNumber,purpose]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_year_branch_division_groupNumber_purpose_key" ON "Group"("year", "branch", "division", "groupNumber", "purpose");
