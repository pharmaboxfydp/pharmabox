/*
  Warnings:

  - Added the required column `label` to the `locker_box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locker_box" ADD COLUMN     "label" INTEGER NOT NULL;
