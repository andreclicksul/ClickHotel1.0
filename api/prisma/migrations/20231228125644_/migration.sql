-- CreateTable
CREATE TABLE "tb_audit" (
    "id" TEXT NOT NULL,
    "dtregister" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typemodule" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "beforeinf" TEXT,
    "currentinf" TEXT,
    "ipaccess" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "tb_audit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_audit" ADD CONSTRAINT "tb_audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
