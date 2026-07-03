// certificates/certificateController.js
const certificatesService = require('./certificateService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');
const cloudinary = require('../../config/cloudinary');
const logger = require('../../utils/logger');
const https = require('https');
const path = require('path');

function safeFilename(value) {
  return String(value || 'certificate')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extract the Cloudinary public_id from a secure_url as a fallback
 * when pdfPublicId was not persisted to the DB.
 *
 * Input:  https://res.cloudinary.com/demo/raw/upload/v1234/folder/file.pdf
 * Output: folder/file
 *
 * The extension is stripped because Cloudinary public_ids never include it.
 */
function extractPublicId(url) {
  const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
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
  const options = {
    page: page || 1,
    limit: limit || 10,
    sortBy: sortBy || 'issuedAt',
    sortOrder: sortOrder || 'desc',
  };
  const result = await certificatesService.getUserCertificates(req.user.id, options);
  return ApiResponse.paginated(res, result.certificates, result.pagination, 'Certificates retrieved successfully');
});

const batchIssueCertificates = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const results = await certificatesService.batchIssueCertificates(sessionId, req.user.id, req.user.role);
  return ApiResponse.created(res, results, `Issued ${results.issued} certificates, ${results.failed} failed`);
});

/**
 * GET /:id/download
 *
 * Why cloudinary.utils.private_download_url() instead of a CDN URL:
 *
 *   res.cloudinary.com (CDN) URLs for this account return 401 even when
 *   signed, because the account has CDN-level access restrictions that
 *   signatures alone do not bypass (this is an account/plan setting in
 *   the Cloudinary dashboard under Security).
 *
 *   private_download_url() generates a URL that goes through
 *   api.cloudinary.com — Cloudinary's API endpoint, not the CDN.
 *   The request authenticates with your API key + secret via HMAC signature
 *   embedded in the query string. This route is unaffected by CDN access
 *   settings and is the correct server-side download method.
 *
 *   Generated URL shape:
 *     https://api.cloudinary.com/v1_1/{cloud}/raw/download
 *       ?api_key=...&timestamp=...&signature=...&public_id=...&expires_at=...
 *
 *   The file bytes come back on that request, which we pipe straight to
 *   the Express response — no temp files, no buffering in memory.
 */
const downloadCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await certificatesService.getCertificateForDownload(req.params.id, req.user);
  const filename = safeFilename(`${certificate.certCode}.pdf`);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-cache');

  // Legacy: local file under /uploads/ (pre-Cloudinary)
  if (certificate.pdfUrl.startsWith('/uploads/')) {
    const localPath = path.join(__dirname, '../../', certificate.pdfUrl.replace(/^\/+/, ''));
    return res.download(localPath, filename);
  }

  // Resolve the Cloudinary public_id — use the stored value, fall back to
  // extracting it from the URL if pdfPublicId wasn't persisted for older certs.
  const publicId = certificate.pdfPublicId || extractPublicId(certificate.pdfUrl);

  if (!publicId) {
    return next(new Error('Cannot determine certificate public_id — cannot download'));
  }

  logger.info('Certificate download: resolving via Cloudinary API', {
    certCode: certificate.certCode,
    publicId,
  });

  // private_download_url authenticates via API key+secret — bypasses all CDN restrictions
  const apiDownloadUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
    resource_type: 'raw',
    type: 'upload',
    expires_at: Math.floor(Date.now() / 1000) + 300, // 5-minute window
    attachment: false, // we set Content-Disposition ourselves above
  });

  const upstream = https.get(apiDownloadUrl, (cloudinaryRes) => {
    if (cloudinaryRes.statusCode !== 200) {
      cloudinaryRes.resume(); // drain so socket is released
      return next(new Error(`Cloudinary API returned HTTP ${cloudinaryRes.statusCode} for certificate PDF`));
    }

    // Forward Content-Length so axios onDownloadProgress gives real percentages
    const contentLength = cloudinaryRes.headers['content-length'];
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    cloudinaryRes.pipe(res);
    cloudinaryRes.on('error', next);
  });

  upstream.on('error', next);
});

/**
 * GET / — Get all certificates (Admin only)
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
    limit = 10,
  } = req.query;

  const filters = { search, status, fromDate, toDate, sortBy, sortOrder };
  const result = await certificatesService.getAllCertificates(filters, parseInt(page), parseInt(limit));

  return ApiResponse.paginated(
    res,
    result.certificates,
    result.pagination,
    'Certificates retrieved successfully'
  );
});

/**
 * GET /stats — Certificate statistics (Admin only)
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