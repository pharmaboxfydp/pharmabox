-- AlterTable
ALTER TABLE "locations" DROP COLUMN "address",
ALTER COLUMN "phoneNumber" SET DEFAULT '',
ADD COLUMN     "cardinalDirection" TEXT,
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "province" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "streetAddress" TEXT NOT NULL DEFAULT '';
