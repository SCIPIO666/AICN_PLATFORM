-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "emailedAt" TIMESTAMP(3),
ADD COLUMN     "pdfPublicId" TEXT,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "revokedAt" TIMESTAMP(3);
