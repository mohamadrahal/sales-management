-- AlterTable
ALTER TABLE `Team` ADD COLUMN `managerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
