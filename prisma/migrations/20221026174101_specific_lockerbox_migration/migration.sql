/*
  Warnings:

  - A unique constraint covering the columns `[label,lockerId]` on the table `locker_box` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "locker_box_label_lockerId_key" ON "locker_box"("label", "lockerId");
