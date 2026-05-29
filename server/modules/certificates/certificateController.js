// certificates/certificateController.js
const certificatesService = require('./certificateService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');

const issueCertificate = asyncHandler(async (req, res) => {
  const { userId, sessionId } = req.body;
  const certificate = await certificatesService.issueCertificate(userId, sessionId, req.user.id, req.user.role);
  return ApiResponse.created(res, certificate, 'Certificate issued successfully');
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { certCode } = req.params;
  const certificate = await certificatesService.verifyCertificate(certCode);
  return ApiResponse.success(res, certificate, 'Certificate verified successfully');
});

const getMyCertificates = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, sortOrder } = req.query;
  const options = { page: page || 1, limit: limit || 10, sortBy: sortBy || 'issuedAt', sortOrder: sortOrder || 'desc' };
  const result = await certificatesService.getUserCertificates(req.user.id, options);
  return ApiResponse.paginated(res, result.certificates, result.pagination, 'Certificates retrieved successfully');
});

const batchIssueCertificates = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const results = await certificatesService.batchIssueCertificates(sessionId, req.user.id, req.user.role);
  return ApiResponse.created(res, results, `Issued ${results.issued} certificates, ${results.failed} failed`);
});

module.exports = { issueCertificate, verifyCertificate, getMyCertificates, batchIssueCertificates };