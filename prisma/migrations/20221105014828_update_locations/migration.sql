/*
  Warnings:

  - You are about to drop the column `address` on the `locations` table. All the data in the column will be lost.
  - Added the required column `city` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "address",
ADD COLUMN     "cardinalDirection" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "streetAddress" TEXT NOT NULL;
