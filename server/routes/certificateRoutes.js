const express = require('express');
const certificatesRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const certificatesController = require('../modules/certificates/certificateController');

// Public routes
certificatesRouter.get('/verify/:certCode', certificatesController.verifyCertificate);

// Protected routes
certificatesRouter.use(verifyToken);
certificatesRouter.get('/my', certificatesController.getMyCertificates);
certificatesRouter.post('/batch/:sessionId', 
  verifyToken, 
  requireRole(['ADMIN']), 
  certificatesController.batchIssueCertificates
);

certificatesRouter.post('/', requireRole(['ADMIN']), certificatesController.issueCertificate);


module.exports = certificatesRouter;