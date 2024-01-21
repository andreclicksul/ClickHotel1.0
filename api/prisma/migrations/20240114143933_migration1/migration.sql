-- CreateTable
CREATE TABLE "tb_users" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "sunday" BOOLEAN NOT NULL DEFAULT false,
    "monday" BOOLEAN NOT NULL DEFAULT false,
    "tuesday" BOOLEAN NOT NULL DEFAULT false,
    "wednesday" BOOLEAN NOT NULL DEFAULT false,
    "thursday" BOOLEAN NOT NULL DEFAULT false,
    "friday" BOOLEAN NOT NULL DEFAULT false,
    "saturday" BOOLEAN NOT NULL DEFAULT false,
    "client" INTEGER NOT NULL,
    "caduser" INTEGER NOT NULL,
    "checklist" INTEGER NOT NULL,
    "provider" INTEGER NOT NULL,
    "audit" INTEGER NOT NULL,
    "accountpay" INTEGER NOT NULL,
    "accountreceive" INTEGER NOT NULL,
    "financial" INTEGER NOT NULL,
    "product" INTEGER NOT NULL,
    "occupationmap" INTEGER NOT NULL,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "dtregister" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastchange" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "avatar" INTEGER NOT NULL,
    "starthour" TEXT NOT NULL,
    "startminute" TEXT NOT NULL,
    "finishhour" TEXT NOT NULL,
    "finishminute" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_audit" (
    "id" TEXT NOT NULL,
    "dtregister" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typemodule" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "beforeinf" TEXT,
    "currentinf" TEXT,
    "ipaccess" TEXT NOT NULL,
    "iduser" TEXT NOT NULL,

    CONSTRAINT "tb_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_user_key" ON "tb_users"("user");

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- AddForeignKey
ALTER TABLE "tb_audit" ADD CONSTRAINT "tb_audit_iduser_fkey" FOREIGN KEY ("iduser") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
