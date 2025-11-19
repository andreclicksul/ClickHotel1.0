-- CreateTable
CREATE TABLE "tb_client" (
    "idclient" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dtregister" TIMESTAMP(3) NOT NULL DEFAULT timezone('America/Sao_Paulo', now()),
    "desname" TEXT NOT NULL,
    "dtnasc" DATE NOT NULL,
    "descel" TEXT,
    "descep" TEXT,
    "desstreet" TEXT,
    "desnumber" TEXT,
    "descomplement" TEXT,
    "desdistrict" TEXT,
    "descity" TEXT,
    "desuf" TEXT,
    "descpf" TEXT,
    "desemail" TEXT,
    "desrestalimentar" TEXT,
    "desveiculo" TEXT,
    "desobs" TEXT,
    "lastchange" TEXT,

    CONSTRAINT "tb_client_pkey" PRIMARY KEY ("idclient")
);

-- CreateTable
CREATE TABLE "tb_provider" (
    "idprovider" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dtregister" TIMESTAMP(3) NOT NULL DEFAULT timezone('America/Sao_Paulo', now()),
    "desname" TEXT NOT NULL,
    "descorporate" TEXT,
    "desphone" TEXT,
    "descel" TEXT,
    "descep" TEXT,
    "desstreet" TEXT,
    "desnumber" TEXT,
    "descomplement" TEXT,
    "desdistrict" TEXT,
    "descity" TEXT,
    "desuf" TEXT,
    "descnpj" TEXT,
    "desie" TEXT,
    "desobs" TEXT,
    "desemail" TEXT,
    "lastchange" TEXT,
    "inactive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_provider_pkey" PRIMARY KEY ("idprovider")
);
