-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT false;
