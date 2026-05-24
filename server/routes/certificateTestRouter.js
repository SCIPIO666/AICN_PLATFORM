const express = require('express');
const certificateTestRouter = express.Router();
const certificateTestController = require('../utils/pdf/templates/certificates/test/certificateController');

// test endpoints only 
certificateTestRouter.get('/preview', certificateTestController.previewCertificate);
certificateTestRouter.get('/download', certificateTestController.downloadTestCertificate);
certificateTestRouter.get('/batch', certificateTestController.batchTestCertificates);
certificateTestRouter.get('/html', certificateTestController.previewHTML);
certificateTestRouter.get('/css', certificateTestController.previewCSS);

module.exports = certificateTestRouter;