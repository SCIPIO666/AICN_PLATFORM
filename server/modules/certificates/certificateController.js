// certificates/certificateController.js
const certificatesService = require('./certificateService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');
const path = require('path');
const { Readable } = require('stream');

function safeFilename(value) {
  return String(value || 'certificate')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

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

const downloadCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await certificatesService.getCertificateForDownload(req.params.id, req.user);
  const filename = safeFilename(`${certificate.certCode}.pdf`);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  if (certificate.pdfUrl.startsWith('/uploads/')) {
    const localPath = path.join(__dirname, '../../', certificate.pdfUrl.replace(/^\/+/, ''));
    return res.download(localPath, filename);
  }

  const upstream = await fetch(certificate.pdfUrl);
  if (!upstream.ok || !upstream.body) {
    throw new Error(`Could not fetch certificate PDF (${upstream.status})`);
  }

  const contentLength = upstream.headers.get('content-length');
  if (contentLength) {
    res.setHeader('Content-Length', contentLength);
  }

  const stream = Readable.fromWeb(upstream.body);
  stream.on('error', next);
  return stream.pipe(res);
});
/**
 * Get all certificates (Admin only)
 */
const getAllCertificates = asyncHandler(async (req, res) => {
  const { 
    search, 
    status, 
    fromDate, 
    toDate,
    sortBy = 'issuedAt',
    sortOrder = 'desc',
    page = 1, 
    limit = 10 
  } = req.query;
  
  const filters = { search, status, fromDate, toDate, sortBy, sortOrder };
  
  const result = await certificatesService.getAllCertificates(
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  return ApiResponse.paginated(
    res,
    result.certificates,
    result.pagination,
    'Certificates retrieved successfully'
  );
});

/**
 * Get certificate statistics (Admin only)
 */
const getCertificateStats = asyncHandler(async (req, res) => {
  const stats = await certificatesService.getCertificateStats();
  return ApiResponse.success(res, stats, 'Certificate statistics retrieved successfully');
});
module.exports = {
  issueCertificate,
  verifyCertificate,
  getMyCertificates,
  downloadCertificate,
  batchIssueCertificates,
  getAllCertificates,
  getCertificateStats,
};
