/*
  Warnings:

  - Added the required column `excelPath` to the `ContractReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ContractReport` ADD COLUMN `excelPath` VARCHAR(191) NOT NULL;
