/*
  Warnings:

  - A unique constraint covering the columns `[managerId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Team` ADD COLUMN `managerId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Team_managerId_key` ON `Team`(`managerId`);

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
