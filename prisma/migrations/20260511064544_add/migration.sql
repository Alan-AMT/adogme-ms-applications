-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
