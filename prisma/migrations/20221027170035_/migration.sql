/*
  Warnings:

  - You are about to drop the column `lockerId` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `lockerId` on the `locker_box` table. All the data in the column will be lost.
  - You are about to drop the `lockers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[label,locationId]` on the table `locker_box` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `locker_box` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_lockerId_fkey";

-- DropForeignKey
ALTER TABLE "locker_box" DROP CONSTRAINT "locker_box_lockerId_fkey";

-- DropIndex
DROP INDEX "locations_lockerId_key";

-- DropIndex
DROP INDEX "locker_box_label_lockerId_key";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "lockerId";

-- AlterTable
ALTER TABLE "locker_box" DROP COLUMN "lockerId",
ADD COLUMN     "locationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "lockers";

-- CreateIndex
CREATE UNIQUE INDEX "locker_box_label_locationId_key" ON "locker_box"("label", "locationId");

-- AddForeignKey
ALTER TABLE "locker_box" ADD CONSTRAINT "locker_box_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
