/*
  Warnings:

  - You are about to drop the column `periodFrom` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `targetOwnerId` on the `Target` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Target` DROP FOREIGN KEY `SalesmanTarget`;

-- DropForeignKey
ALTER TABLE `Target` DROP FOREIGN KEY `TeamTarget`;

-- AlterTable
ALTER TABLE `Target` DROP COLUMN `periodFrom`,
    DROP COLUMN `targetOwnerId`,
    ADD COLUMN `teamId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Target` ADD CONSTRAINT `Target_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Target` ADD CONSTRAINT `Target_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
