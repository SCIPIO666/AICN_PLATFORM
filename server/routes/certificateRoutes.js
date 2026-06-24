// modules/certificates/certificateRoutes.js
const express = require('express');
const certificatesRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const certificatesController = require('./certificateController');
const validate = require('../middleware/validate');

// Import validation schemas
const { 
  issueCertificateSchema,
  verifyCertificateSchema,
  batchIssueCertificatesSchema,
  getCertificatesQuerySchema,
  getAllCertificatesQuerySchema, 
} = require('../../shared/validators/certificateValidation.cjs');

// ============ PUBLIC ROUTES ============
// GET /verify/:certCode - Public certificate verification
certificatesRouter.get(
  '/verify/:certCode',
  validate(verifyCertificateSchema, 'params'),
  certificatesController.verifyCertificate
);

// ============ PROTECTED ROUTES (Authentication required) ============
certificatesRouter.use(verifyToken);

// GET /me - Get current user's certificates
certificatesRouter.get(
  '/me',
  validate(getCertificatesQuerySchema, 'query'),  
  certificatesController.getMyCertificates
);

// ============ ADMIN ONLY ROUTES ============

// GET / - Get all certificates (Admin only)
certificatesRouter.get(
  '/',
  requireRole('ADMIN'),
  validate(getAllCertificatesQuerySchema, 'query'), 
  certificatesController.getAllCertificates          
);

// GET /stats - Get certificate statistics (Admin only)
certificatesRouter.get(
  '/stats',
  requireRole('ADMIN'),
  certificatesController.getCertificateStats          
);

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
  validate(issueCertificateSchema, 'body'),  
  certificatesController.issueCertificate
);

module.exports = certificatesRouter;