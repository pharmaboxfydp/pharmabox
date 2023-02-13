-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "pharmacistId" INTEGER,
ADD COLUMN     "staffId" INTEGER;

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "is_authoized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pharmacistId" INTEGER;

-- CreateTable
CREATE TABLE "pharmacist" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_on_duty" BOOLEAN NOT NULL DEFAULT false,
    "locationId" INTEGER,

    CONSTRAINT "pharmacist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pharmacist_id_key" ON "pharmacist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacist_userId_key" ON "pharmacist"("userId");

-- AddForeignKey
ALTER TABLE "pharmacist" ADD CONSTRAINT "pharmacist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacist" ADD CONSTRAINT "pharmacist_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "pharmacist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "pharmacist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
