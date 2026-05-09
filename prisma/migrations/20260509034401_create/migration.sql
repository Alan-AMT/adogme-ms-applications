/*
  Warnings:

  - You are about to drop the column `applicantComments` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `shelterComments` on the `Application` table. All the data in the column will be lost.
  - Added the required column `dogBreed` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dogName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formData` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelterName` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'in_review';
ALTER TYPE "ApplicationStatus" ADD VALUE 'cancelled';

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "applicantComments",
DROP COLUMN "shelterComments",
ADD COLUMN     "compatibilityScore" DOUBLE PRECISION,
ADD COLUMN     "dogBreed" TEXT NOT NULL,
ADD COLUMN     "dogImage" TEXT,
ADD COLUMN     "dogName" TEXT NOT NULL,
ADD COLUMN     "formData" JSONB NOT NULL,
ADD COLUMN     "shelterLogo" TEXT,
ADD COLUMN     "shelterName" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateTable
CREATE TABLE "ApplicationReview" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus" NOT NULL,
    "toStatus" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationReview_id_key" ON "ApplicationReview"("id");

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE INDEX "Application_shelterId_status_idx" ON "Application"("shelterId", "status");

-- AddForeignKey
ALTER TABLE "ApplicationReview" ADD CONSTRAINT "ApplicationReview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
