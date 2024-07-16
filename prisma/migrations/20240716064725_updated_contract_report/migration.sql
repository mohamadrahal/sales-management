/*
  Warnings:

  - The primary key for the `ContractReport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contractId` on the `ContractReport` table. All the data in the column will be lost.
  - Added the required column `id` to the `ContractReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ContractReport` DROP FOREIGN KEY `ContractReport_contractId_fkey`;

-- AlterTable
ALTER TABLE `ContractReport` DROP PRIMARY KEY,
    DROP COLUMN `contractId`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `_ContractToContractReport` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ContractToContractReport_AB_unique`(`A`, `B`),
    INDEX `_ContractToContractReport_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ContractToContractReport` ADD CONSTRAINT `_ContractToContractReport_A_fkey` FOREIGN KEY (`A`) REFERENCES `Contract`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ContractToContractReport` ADD CONSTRAINT `_ContractToContractReport_B_fkey` FOREIGN KEY (`B`) REFERENCES `ContractReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
