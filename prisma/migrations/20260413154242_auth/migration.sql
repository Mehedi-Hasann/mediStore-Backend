/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "address_id_userId_key" ON "address"("id", "userId");
