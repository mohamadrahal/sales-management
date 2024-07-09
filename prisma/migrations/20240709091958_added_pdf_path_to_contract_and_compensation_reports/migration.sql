/*
  Warnings:

  - Added the required column `pdfPath` to the `CompensationReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfPath` to the `ContractReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CompensationReport` ADD COLUMN `pdfPath` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ContractReport` ADD COLUMN `pdfPath` VARCHAR(191) NOT NULL;
