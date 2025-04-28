/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Blog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_categoryId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "categoryId",
ALTER COLUMN "publishedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "_BlogCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BlogCategories_B_index" ON "_BlogCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_hashedToken_key" ON "User"("hashedToken");

-- AddForeignKey
ALTER TABLE "_BlogCategories" ADD CONSTRAINT "_BlogCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogCategories" ADD CONSTRAINT "_BlogCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
