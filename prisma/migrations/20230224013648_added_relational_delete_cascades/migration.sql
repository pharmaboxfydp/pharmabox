-- DropForeignKey
ALTER TABLE "locker_box" DROP CONSTRAINT "locker_box_locationId_fkey";

-- DropForeignKey
ALTER TABLE "pharmacist" DROP CONSTRAINT "pharmacist_locationId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_locationId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_pharmacistId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "firstName" SET DEFAULT 'Player',
ALTER COLUMN "lastName" SET DEFAULT 'One';

-- AddForeignKey
ALTER TABLE "pharmacist" ADD CONSTRAINT "pharmacist_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "pharmacist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locker_box" ADD CONSTRAINT "locker_box_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
