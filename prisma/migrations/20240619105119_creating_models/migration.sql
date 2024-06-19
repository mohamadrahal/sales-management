-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` ENUM('Tripoli', 'Benghazi', 'Misrata', 'Bayda', 'Zawiya', 'Khoms', 'Tobruk', 'Ajdabiya', 'Sebha', 'Sirte', 'Derna', 'Zliten', 'Sabratha', 'Ghat', 'Jalu') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Target` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `targetOwnerId` INTEGER NOT NULL,
    `periodFrom` DATETIME(3) NOT NULL,
    `periodTo` DATETIME(3) NOT NULL,
    `targetType` ENUM('Team', 'Salesman') NOT NULL,
    `numberOfContracts` INTEGER NOT NULL,
    `totalAmountLYD` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Contract', 'Compensation') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contract` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salesmanId` INTEGER NOT NULL,
    `type` ENUM('Subagent', 'Merchant', 'Both') NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `businessType` ENUM('Retail', 'Wholesale', 'FoodService', 'Manufacturing', 'Technology', 'Healthcare', 'FinancialServices', 'RealEstate', 'Education', 'Transportation', 'Entertainment', 'NonProfit') NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `ownerMobileNumber` VARCHAR(191) NOT NULL,
    `companyMobileNumber` VARCHAR(191) NOT NULL,
    `contactPersonName` VARCHAR(191) NOT NULL,
    `contactPersonMobileNumber` VARCHAR(191) NOT NULL,
    `bcdAccountNumber` VARCHAR(191) NULL,
    `numberOfBranches` INTEGER NOT NULL,
    `documentPath` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Declined') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContractReport` (
    `contractId` INTEGER NOT NULL,
    `reportId` INTEGER NOT NULL,

    PRIMARY KEY (`contractId`, `reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompensationReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportId` INTEGER NOT NULL,
    `teamId` INTEGER NULL,
    `salesmanId` INTEGER NULL,
    `amountPaid` DOUBLE NOT NULL,
    `bonusAmount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contractId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `city` ENUM('Tripoli', 'Benghazi', 'Misrata', 'Bayda', 'Zawiya', 'Khoms', 'Tobruk', 'Ajdabiya', 'Sebha', 'Sirte', 'Derna', 'Zliten', 'Sabratha', 'Ghat', 'Jalu') NOT NULL,
    `locationX` DOUBLE NOT NULL,
    `locationY` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('Admin', 'SalesManager', 'Salesman') NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `teamId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `bcdAccount` VARCHAR(191) NULL,
    `evoAppId` VARCHAR(191) NOT NULL,
    `nationalId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Target` ADD CONSTRAINT `TeamTarget` FOREIGN KEY (`targetOwnerId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Target` ADD CONSTRAINT `SalesmanTarget` FOREIGN KEY (`targetOwnerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_salesmanId_fkey` FOREIGN KEY (`salesmanId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContractReport` ADD CONSTRAINT `ContractReport_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContractReport` ADD CONSTRAINT `ContractReport_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompensationReport` ADD CONSTRAINT `CompensationReport_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompensationReport` ADD CONSTRAINT `CompensationReport_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompensationReport` ADD CONSTRAINT `CompensationReport_salesmanId_fkey` FOREIGN KEY (`salesmanId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
