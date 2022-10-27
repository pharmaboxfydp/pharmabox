-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;
