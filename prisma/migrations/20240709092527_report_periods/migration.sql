/*
  Warnings:

  - Added the required column `periodFrom` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodTo` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Report` ADD COLUMN `periodFrom` DATETIME(3) NOT NULL,
    ADD COLUMN `periodTo` DATETIME(3) NOT NULL;
