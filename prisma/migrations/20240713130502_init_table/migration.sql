/*
  Warnings:

  - You are about to drop the column `desciprion` on the `todos` table. All the data in the column will be lost.
  - Added the required column `description` to the `todos` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `todos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `todos` DROP COLUMN `desciprion`,
    ADD COLUMN `description` TEXT NOT NULL,
    MODIFY `status` VARCHAR(100) NOT NULL;
