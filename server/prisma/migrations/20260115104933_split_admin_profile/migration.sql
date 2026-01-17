/*
  Warnings:

  - Added the required column `socials` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `techStack` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "description" TEXT,
ADD COLUMN     "socials" JSONB NOT NULL,
ADD COLUMN     "techStack" JSONB NOT NULL;
