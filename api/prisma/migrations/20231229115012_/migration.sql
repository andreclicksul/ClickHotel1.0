/*
  Warnings:

  - You are about to drop the column `userId` on the `tb_audit` table. All the data in the column will be lost.
  - You are about to drop the column `finishTime` on the `tb_users` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `tb_users` table. All the data in the column will be lost.
  - The `deleted` column on the `tb_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `iduser` to the `tb_audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finishtime` to the `tb_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starttime` to the `tb_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_audit" DROP CONSTRAINT "tb_audit_userId_fkey";

-- AlterTable
ALTER TABLE "tb_audit" DROP COLUMN "userId",
ADD COLUMN     "iduser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tb_users" DROP COLUMN "finishTime",
DROP COLUMN "startTime",
ADD COLUMN     "finishtime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "starttime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deleted",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "tb_audit" ADD CONSTRAINT "tb_audit_iduser_fkey" FOREIGN KEY ("iduser") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
