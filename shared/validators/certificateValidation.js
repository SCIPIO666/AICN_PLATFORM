const { z } = require('zod');

// ID validation (assuming UUID format - adjust if using CUID)
const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format - must be a valid UUID'),
  sessionId: z.string().uuid('Invalid session ID format - must be a valid UUID'),
  userId: z.string().uuid('Invalid user ID format - must be a valid UUID')
});

// Issue certificate validation
const issueCertificateSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID format - must be a valid UUID'),
  sessionId: z.string()
    .uuid('Invalid session ID format - must be a valid UUID')
});

// Single issue certificate (alternative schema for body)
const issueSingleCertificateSchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().uuid()
});

// Verify certificate validation
const verifyCertificateSchema = z.object({
  certCode: z.string()
    .regex(/^CERT-[A-F0-9]{16}$/, 'Invalid certificate code format. Expected format: CERT-XXXXXXXXXXXXXXX')
    .min(21, 'Certificate code must be 21 characters')
    .max(21, 'Certificate code must be 21 characters')
});

// Batch issue certificates validation
const batchIssueCertificatesSchema = z.object({
  sessionId: z.string()
    .uuid('Invalid session ID format - must be a valid UUID')
});

// Certificate filters validation
const certificateFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
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

module.exports = {
  idParamSchema,
  issueCertificateSchema,
  issueSingleCertificateSchema,
  verifyCertificateSchema,
  batchIssueCertificatesSchema,
  certificateFiltersSchema,
  getCertificatesQuerySchema
};