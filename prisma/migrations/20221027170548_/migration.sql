/*
  Warnings:

  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT;
