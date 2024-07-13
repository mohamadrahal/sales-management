/*
  Warnings:

  - Added the required column `excelPath` to the `CompensationReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CompensationReport` ADD COLUMN `excelPath` VARCHAR(191) NOT NULL;
