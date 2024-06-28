/*
  Warnings:

  - You are about to drop the column `managerId` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Team` DROP FOREIGN KEY `Team_managerId_fkey`;

-- AlterTable
ALTER TABLE `Team` DROP COLUMN `managerId`;
