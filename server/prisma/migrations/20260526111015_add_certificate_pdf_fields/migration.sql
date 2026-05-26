/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- DropTable
DROP TABLE "Certificate";

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "certCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "pdfPublicId" TEXT,
    "pdfVersion" INTEGER,
    "pdfSize" INTEGER,
    "pdfFormat" TEXT,
    "pdfResourceType" TEXT,
    "pdfCreatedAt" TIMESTAMP(3),
    "pdfEtag" TEXT,
    "pdfSignature" TEXT,
    "pdfAssetFolder" TEXT,
    "pdfOriginalFilename" TEXT,
    "pdfGenerationFailed" BOOLEAN DEFAULT false,
    "pdfFailureReason" TEXT,
    "pdfFailedAt" TIMESTAMP(3),

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certCode_key" ON "certificates"("certCode");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
