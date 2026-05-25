const fs = require('fs');

const path = require('path');

const uploadPdf = require('../../media storage/uploadPdf');

async function savePdfToStorage(pdfBuffer,certificate) {

  const tempDir = path.join(__dirname,'../temporaryStorage');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(temporaryStorage);
  }

  const tempPath = path.join(
    tempDir,
    `${certificate.certCode}.pdf`
  );

  fs.writeFileSync(tempPath, pdfBuffer);//saving temporary certificate

  const uploaded = await uploadPdf(
    tempPath,
    certificate.userId
  );

  fs.unlinkSync(tempPath);//removing temporary certificate

  return uploaded;
}

module.exports = savePdfToStorage;