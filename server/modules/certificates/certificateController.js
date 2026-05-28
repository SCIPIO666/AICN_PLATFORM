const certificatesService = require('./certificateService');
const logger = require('../../utils/logger');

/**
 * Issue a single certificate (Admin only)
 * POST /api/certificates
 */
const issueCertificate = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.body;
    
    const certificate = await certificatesService.issueCertificate(
      userId,
      sessionId,
      req.user.id,
      req.user.role
    );
    
    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: certificate
    });
  } catch (err) {
    logger.error(`Failed to issue certificate: ${err.message}`);
    next(err);
  }
};

/**
 * Verify a certificate by code (Public)
 * GET /api/certificates/verify/:certCode
 */
const verifyCertificate = async (req, res, next) => {
  try {
    const { certCode } = req.params;
    
    const certificate = await certificatesService.verifyCertificate(certCode);
    
    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (err) {
    logger.error(`Failed to verify certificate: ${err.message}`);
    
    // Handle specific error types
    if (err.message === 'Certificate not found') {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid code'
      });
    }
    
    if (err.message === 'Certificate has been revoked') {
      return res.status(410).json({
        success: false,
        message: 'This certificate has been revoked'
      });
    }
    
    next(err);
  }
};

/**
 * Get current user's certificates
 * GET /api/certificates/my
 */
const getMyCertificates = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;
    
    const options = {
      page: page || 1,
      limit: limit || 10,
      sortBy: sortBy || 'issuedAt',
      sortOrder: sortOrder || 'desc'
    };
    
    const result = await certificatesService.getUserCertificates(
      req.user.id,
      options
    );
    
    res.status(200).json({
      success: true,
      data: result.certificates,
      pagination: result.pagination
    });
  } catch (err) {
    logger.error(`Failed to get certificates: ${err.message}`);
    next(err);
  }
};

/**
 * Batch issue certificates for a session (Admin only)
 * POST /api/certificates/batch/:sessionId
 */
const batchIssueCertificates = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    const results = await certificatesService.batchIssueCertificates(
      sessionId,
      req.user.id,
      req.user.role
    );
    
    res.status(201).json({
      success: true,
      message: `Issued ${results.issued} certificates, ${results.failed} failed`,
      data: {
        total: results.total,
        issued: results.issued,
        failed: results.failed,
        errors: results.errors || []
      }
    });
  } catch (err) {
    logger.error(`Failed to batch issue certificates: ${err.message}`);
    
    if (err.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (err.message === 'No eligible users found for this session') {
      return res.status(400).json({
        success: false,
        message: 'No eligible users found for this session'
      });
    }
    
    next(err);
  }
};

module.exports = {
  issueCertificate,
  verifyCertificate,
  getMyCertificates,
  batchIssueCertificates
};