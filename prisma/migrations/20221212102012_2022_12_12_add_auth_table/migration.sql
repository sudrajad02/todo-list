-- CreateTable
CREATE TABLE `auth_level` (
    `level_id` INTEGER NOT NULL AUTO_INCREMENT,
    `level_name` VARCHAR(191) NULL,
    `level` INTEGER NULL,

    PRIMARY KEY (`level_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_level_access` (
    `level_access_id` INTEGER NOT NULL,
    `level_access_path` VARCHAR(191) NULL,

    UNIQUE INDEX `auth_level_access_level_access_id_key`(`level_access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `createdeAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastAccessAt` DATETIME(3) NULL,

    UNIQUE INDEX `auth_user_user_name_key`(`user_name`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_user_level` (
    `user_level_id` INTEGER NOT NULL,
    `level_access_id` INTEGER NOT NULL,

    UNIQUE INDEX `auth_user_level_user_level_id_key`(`user_level_id`),
    UNIQUE INDEX `auth_user_level_level_access_id_key`(`level_access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_level_access` ADD CONSTRAINT `auth_level_access_level_access_id_fkey` FOREIGN KEY (`level_access_id`) REFERENCES `auth_level`(`level_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_user_level` ADD CONSTRAINT `auth_user_level_user_level_id_fkey` FOREIGN KEY (`user_level_id`) REFERENCES `auth_user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_user_level` ADD CONSTRAINT `auth_user_level_level_access_id_fkey` FOREIGN KEY (`level_access_id`) REFERENCES `auth_level`(`level_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
