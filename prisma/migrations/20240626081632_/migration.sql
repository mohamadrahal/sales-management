/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Branch_phone_key` ON `Branch`(`phone`);
