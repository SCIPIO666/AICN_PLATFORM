const logger=require('../logger')
const prisma=require('../../config/db')
const cloudinary=require('../../config/cloudinary')
async function getCertificatePDFDetails(certificateId) {
  try {
     const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    select: {
      pdfUrl: true,
      pdfPublicId: true,
      pdfSize: true,
      pdfVersion: true,
      pdfCreatedAt: true
    }
  });
  
  return certificate;
  } catch (error) {
    logger.info(`failed to get certificate pdf details: ${error.message}`)
    throw error
  }
 
}

// Helper to delete PDF from Cloudinary
async function deleteCertificatePDF(certificateId) {
  try {
     const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    select: { pdfPublicId: true }
  });
  
  if (certificate?.pdfPublicId) {
    await cloudinary.uploader.destroy(certificate.pdfPublicId, {
      resource_type: 'raw'
    });
    
    await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        pdfUrl: null,
        pdfPublicId: null,
        pdfMetadata: null
      }
    });
  }
  } catch (error) {
      logger.info(`failed to remove certificate pdf details: ${error.message}`)
    throw error
  }
  
 
}