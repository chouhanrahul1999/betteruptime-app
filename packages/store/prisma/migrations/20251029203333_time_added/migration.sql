/*
  Warnings:

  - You are about to drop the column `timeAdded` on the `website` table. All the data in the column will be lost.
  - Added the required column `time_added` to the `website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "website" DROP COLUMN "timeAdded",
ADD COLUMN     "time_added" TIMESTAMP(3) NOT NULL;
