-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_userId_fkey";

-- DropForeignKey
ALTER TABLE "pharmacist" DROP CONSTRAINT "pharmacist_userId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_userId_fkey";

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacist" ADD CONSTRAINT "pharmacist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
