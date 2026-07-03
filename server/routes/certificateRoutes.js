
const express = require('express');
const certificatesRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const certificatesController = require('../modules/certificates/certificateController');
const validate = require('../middleware/validate');

const {
  issueCertificateSchema,
  verifyCertificateSchema,
  batchIssueCertificatesSchema,
  getCertificatesQuerySchema,
  getAllCertificatesQuerySchema,
  certificateIdParamSchema,
} = require('../../shared/validators/certificateValidation.cjs');

// ============ PUBLIC ============

// GET /verify/:certCode
certificatesRouter.get(
  '/verify/:certCode',
  validate(verifyCertificateSchema, 'params'),
  certificatesController.verifyCertificate
);

// ============ PROTECTED (auth required for everything below) ============
certificatesRouter.use(verifyToken);

// GET /me — learner's own certificates
// Must be declared BEFORE /:id routes so Express doesn't swallow "me" as an id param
certificatesRouter.get(
  '/me',
  validate(getCertificatesQuerySchema, 'query'),
  certificatesController.getMyCertificates
);

// ============ ADMIN-ONLY named routes ============
// These also must sit BEFORE /:id/download — same reason: "stats" would
// otherwise be captured as an id param and never reach this handler.

// GET /stats
certificatesRouter.get(
  '/stats',
  requireRole('ADMIN'),
  certificatesController.getCertificateStats
);

// GET / — paginated list of all certificates
certificatesRouter.get(
  '/',
  requireRole('ADMIN'),
  validate(getAllCertificatesQuerySchema, 'query'),
  certificatesController.getAllCertificates
);

// POST /batch/:sessionId — batch issue
certificatesRouter.post(
  '/batch/:sessionId',
  requireRole('ADMIN'),
  validate(batchIssueCertificatesSchema, 'params'),
  certificatesController.batchIssueCertificates
);

// POST / — single issue
certificatesRouter.post(
  '/',
  requireRole('ADMIN'),
  validate(issueCertificateSchema, 'body'),
  certificatesController.issueCertificate
);

// ============ PARAM ROUTES (must come last) ============

// GET /:id/download — learner owns cert OR admin; returns Cloudinary download URL
certificatesRouter.get(
  '/:id/download',
  validate(certificateIdParamSchema, 'params'),
  certificatesController.downloadCertificate
);

module.exports = certificatesRouter;