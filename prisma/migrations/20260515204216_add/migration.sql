/*
  Warnings:

  - Made the column `applicantEmail` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shelterEmail` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "applicantEmail" SET NOT NULL,
ALTER COLUMN "shelterEmail" SET NOT NULL;
