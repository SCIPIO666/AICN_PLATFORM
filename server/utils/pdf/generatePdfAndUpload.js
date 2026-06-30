const { generateCertificatePDF } = require('./generators/pdfGenerator');
   const uploadPdf = require('../storage/uploadPdf');

   async function generateCertificatePdfAndStore(certData) {
     const pdfBuffer = await generateCertificatePDF(certData);
     const uploaded = await uploadPdf(pdfBuffer, certData.userId, certData.certCode);
     return { pdfBuffer, uploaded }; // pdfBuffer needed for the email attachment, Url saved to DB
   }
   module.exports = generateCertificatePdfAndStore;