/*
  Warnings:

  - You are about to drop the column `institution` on the `resume` table. All the data in the column will be lost.
  - Made the column `type` on table `resume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `resume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `period` on table `resume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `resume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "resume" DROP COLUMN "institution",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "period" SET NOT NULL,
ALTER COLUMN "period" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL;
