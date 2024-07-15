/*
  Warnings:

  - You are about to drop the column `documentPath` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Contract` DROP COLUMN `documentPath`;

-- CreateTable
CREATE TABLE `ContractDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contractId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContractDocument` ADD CONSTRAINT `ContractDocument_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
