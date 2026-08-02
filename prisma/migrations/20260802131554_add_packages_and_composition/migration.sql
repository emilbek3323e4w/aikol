/*
  Warnings:

  - You are about to drop the column `price` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `composition` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `compositionKg` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "price",
ADD COLUMN     "composition" TEXT NOT NULL,
ADD COLUMN     "compositionKg" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerGuest" INTEGER NOT NULL,
    "fixedItems" TEXT[],
    "fixedItemsKg" TEXT[],
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSelection" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "PackageSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameKg" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "priceNote" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExtraService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageSelection" ADD CONSTRAINT "PackageSelection_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSelection" ADD CONSTRAINT "PackageSelection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
