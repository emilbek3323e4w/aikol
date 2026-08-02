/*
  Warnings:

  - You are about to drop the column `composition` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `compositionKg` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `descKg` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "composition",
DROP COLUMN "compositionKg",
DROP COLUMN "descKg",
DROP COLUMN "description";
