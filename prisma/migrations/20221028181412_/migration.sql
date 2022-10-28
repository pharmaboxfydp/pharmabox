-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "locationId" INTEGER;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
