/*
  Warnings:

  - You are about to drop the column `period` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "period",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Web Development';
