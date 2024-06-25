/*
  Warnings:

  - You are about to drop the column `numberOfBranches` on the `Contract` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Contract` DROP COLUMN `numberOfBranches`;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `User_mobileNumber_key` ON `User`(`mobileNumber`);
