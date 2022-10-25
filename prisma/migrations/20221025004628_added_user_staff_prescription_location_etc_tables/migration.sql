/*
  Warnings:

  - You are about to drop the column `banned` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_enabled` on the `users` table. All the data in the column will be lost.
  - The `created_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "banned",
DROP COLUMN "date_of_birth",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "pickup_enabled",
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'Josh',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT 'Wilkinson',
ADD COLUMN     "last_logged_in" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pickup_enabled" BOOLEAN NOT NULL DEFAULT false,
    "date_of_birth" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pickupTime" TIMESTAMP(3),
    "patientId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "locationId" INTEGER NOT NULL,
    "lockerBoxId" INTEGER NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" BIGINT NOT NULL,
    "lockerId" INTEGER NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lockers" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "lockers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locker_box" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "lockerId" INTEGER,

    CONSTRAINT "locker_box_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_id_key" ON "patients"("id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_id_key" ON "staff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_userId_key" ON "staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_id_key" ON "prescriptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_key" ON "locations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_lockerId_key" ON "locations"("lockerId");

-- CreateIndex
CREATE UNIQUE INDEX "lockers_id_key" ON "lockers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "locker_box_id_key" ON "locker_box"("id");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_lockerBoxId_fkey" FOREIGN KEY ("lockerBoxId") REFERENCES "locker_box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "lockers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locker_box" ADD CONSTRAINT "locker_box_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "lockers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
