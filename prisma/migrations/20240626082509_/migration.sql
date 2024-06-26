/*
  Warnings:

  - A unique constraint covering the columns `[evoAppId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nationalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_evoAppId_key` ON `User`(`evoAppId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_nationalId_key` ON `User`(`nationalId`);
