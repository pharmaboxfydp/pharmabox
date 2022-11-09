/*
  Warnings:

  - A unique constraint covering the columns `[lockerBoxId]` on the table `prescriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_lockerBoxId_key" ON "prescriptions"("lockerBoxId");
