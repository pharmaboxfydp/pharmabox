-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_lockerId_fkey";

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "lockerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "lockers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
