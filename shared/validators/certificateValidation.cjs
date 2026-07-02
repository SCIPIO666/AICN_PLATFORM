const { z } = require('zod');

const CUID_REGEX = /^c[a-z0-9]{24}$/;

// ID validation - all IDs  CUIDs
const idParamSchema = z.object({
  id: z.string().regex(CUID_REGEX, 'Invalid CUID format'),
  sessionId: z.string().regex(CUID_REGEX, 'Invalid CUID format'),
  userId: z.string().regex(CUID_REGEX, 'Invalid CUID format')
});

// Issue certificate validation
const issueCertificateSchema = z.object({
  userId: z.string().regex(CUID_REGEX, 'Invalid CUID format'),
  sessionId: z.string().regex(CUID_REGEX, 'Invalid CUID format')
});

// Single issue certificate
const issueSingleCertificateSchema = z.object({
  userId: z.string().regex(CUID_REGEX, 'Invalid CUID format'),
  sessionId: z.string().regex(CUID_REGEX, 'Invalid CUID format')
});

// Verify certificate validation 
const verifyCertificateSchema = z.object({
  certCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^CERT-[A-F0-9]{16}$/,
      'Invalid certificate code format. Expected format: CERT-XXXXXXXXXXXXXXXX'
    ),
});

// Batch issue certificates validation
const batchIssueCertificatesSchema = z.object({
  sessionId: z.string().regex(CUID_REGEX, 'Invalid CUID format'),
});

const certificateIdParamSchema = z.object({
  id: z.string().regex(CUID_REGEX, 'Invalid CUID format'),
});

// Certificate filters validation
const certificateFiltersSchema = z.object({
  userId: z.string().regex(CUID_REGEX).optional(),
  sessionId: z.string().regex(CUID_REGEX).optional(),
  fromDate: z.string().datetime({ offset: true }).optional(),
  toDate: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

// Query params for getting certificates
const getCertificatesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  sortBy: z.enum(['issuedAt', 'certificateCode']).default('issuedAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional()
});

const getAllCertificatesQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'revoked']).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  sortBy: z.enum(['certCode', 'issuedAt', 'userName', 'sessionTitle']).default('issuedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

module.exports = {
  idParamSchema,
  issueCertificateSchema,
  issueSingleCertificateSchema,
  certificateIdParamSchema,
  verifyCertificateSchema,
  batchIssueCertificatesSchema,
  certificateFiltersSchema,
  getCertificatesQuerySchema,
  getAllCertificatesQuerySchema 
};
