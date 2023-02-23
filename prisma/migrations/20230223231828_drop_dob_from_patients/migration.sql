/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "date_of_birth";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_logged_in" DROP NOT NULL;
