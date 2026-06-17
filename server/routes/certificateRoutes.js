const express = require('express');
const certificatesRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const certificatesController = require('../modules/certificates/certificateController');
const  validate  = require('../middleware/validate');

// Import validation schemas
const { 
  issueCertificateSchema,
  verifyCertificateSchema,
  batchIssueCertificatesSchema,
  getCertificatesQuerySchema
} = require('../../shared/validators/certificateValidation.cjs');

// ============ PUBLIC ROUTES ============
// GET /verify/:certCode - Public certificate verification
certificatesRouter.get(
  '/verify/:certCode',
  validate(verifyCertificateSchema, 'params'),  // ADD VALIDATION
  certificatesController.verifyCertificate
);

// ============ PROTECTED ROUTES (Authentication required) ============
certificatesRouter.use(verifyToken);

// GET /my - Get current user's certificates
certificatesRouter.get(
  '/me',
  validate(getCertificatesQuerySchema, 'query'),  
  certificatesController.getMyCertificates
);

// ============ ADMIN ONLY ROUTES ============
// POST /batch/:sessionId - Batch issue certificates for a session
certificatesRouter.post(
  '/batch/:sessionId',
  requireRole('ADMIN'),
  validate(batchIssueCertificatesSchema, 'params'),  
  certificatesController.batchIssueCertificates
);

// POST / - Issue single certificate (admin only)
certificatesRouter.post(
  '/',
  requireRole('ADMIN'),
  validate(require('../../shared/validators').issueCertificateSchema, 'body'),  
  certificatesController.issueCertificate
);

module.exports = certificatesRouter;