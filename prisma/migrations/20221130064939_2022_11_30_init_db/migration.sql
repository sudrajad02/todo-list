-- CreateTable
CREATE TABLE `todo` (
    `todo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `todo_name` VARCHAR(191) NULL,
    `createdeAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`todo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
