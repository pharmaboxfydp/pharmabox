-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'patient';
