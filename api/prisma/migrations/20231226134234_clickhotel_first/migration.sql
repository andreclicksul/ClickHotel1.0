-- CreateTable
CREATE TABLE "tb_users" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "finishTime" TIMESTAMP(3) NOT NULL,
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
    "deleted" INTEGER NOT NULL,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_user_key" ON "tb_users"("user");

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");
