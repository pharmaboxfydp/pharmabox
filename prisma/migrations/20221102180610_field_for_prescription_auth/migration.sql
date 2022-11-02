/*
  Warnings:

  - Added the required column `pickupCode` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "pickupCode" TEXT NOT NULL;
