const certificatesService = require('./certificateService');
const logger = require('../../utils/logger');

/**
 * @swagger
 * /certificates:
 *   post:
 *     summary: Issue a certificate (ADMIN only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - sessionId
 *             properties:
 *               userId:
 *                 type: string
 *               sessionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Certificate issued successfully
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
      data: certificate
    });
  } catch (err) {
    logger.error(`Failed to issue certificate: ${err.message}`);
    next(err);
  }
};

/**
 * @swagger
 * /certificates/verify/{certCode}:
 *   get:
 *     summary: Verify a certificate
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate verified successfully
 */
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

/**
 * @swagger
 * /certificates/my:
 *   get:
 *     summary: Get my certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully
 */
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

module.exports = {
  issueCertificate,
  verifyCertificate,
  getMyCertificates
};