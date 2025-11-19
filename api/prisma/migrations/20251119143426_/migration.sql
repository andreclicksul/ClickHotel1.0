-- AlterTable
ALTER TABLE "tb_audit" ALTER COLUMN "dtregister" SET DEFAULT timezone('America/Sao_Paulo', now());

-- AlterTable
ALTER TABLE "tb_client" ALTER COLUMN "dtregister" SET DEFAULT timezone('America/Sao_Paulo', now());

-- AlterTable
ALTER TABLE "tb_provider" ALTER COLUMN "dtregister" SET DEFAULT timezone('America/Sao_Paulo', now());

-- AlterTable
ALTER TABLE "tb_users" ALTER COLUMN "dtregister" SET DEFAULT timezone('America/Sao_Paulo', now());
