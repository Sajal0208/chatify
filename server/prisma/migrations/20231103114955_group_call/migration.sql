/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roomName` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostName` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peerId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socketId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Room_roomName_key";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "roomName",
ADD COLUMN     "hostName" TEXT NOT NULL,
ADD COLUMN     "peerId" TEXT NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "socketId" TEXT NOT NULL,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomId_key" ON "Room"("roomId");
