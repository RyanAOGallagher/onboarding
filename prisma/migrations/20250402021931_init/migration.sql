/*
  Warnings:

  - The `createdAt` column on the `Prompt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `modifiedAt` on the `Prompt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "modifiedAt",
ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL;
