-- AlterTable
ALTER TABLE "prescriptions" ALTER COLUMN "status" SET DEFAULT 'Unfilled',
ALTER COLUMN "pickupCode" DROP DEFAULT;
