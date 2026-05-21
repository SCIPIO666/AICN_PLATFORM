const certificatesService = require('./certificateService');
const logger = require('../../utils/logger');

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
      data: certificate
    });
  } catch (err) {
    logger.error(`Failed to issue certificate: ${err.message}`);
    next(err);
  }
};


const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await certificatesService.verifyCertificate(req.params.certCode);
    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (err) {
    logger.error(`Failed to verify certificate: ${err.message}`);
    next(err);
  }
};


const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await certificatesService.getUserCertificates(req.user.id);
    res.status(200).json({
      success: true,
      data: certificates
    });
  } catch (err) {
    logger.error(`Failed to get certificates: ${err.message}`);
    next(err);
  }
};

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
      data: results
    });
  } catch (err) {
    logger.error(`Failed to batch issue certificates: ${err.message}`);
    next(err);
  }
};


module.exports = {
  issueCertificate,
  verifyCertificate,
  getMyCertificates,
  batchIssueCertificates
};