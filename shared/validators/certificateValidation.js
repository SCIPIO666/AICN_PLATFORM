const { z } = require('zod');

// Issue certificate validation
const issueCertificateSchema = z.object({
  userId: z.string().cuid('Invalid user ID format'),
  sessionId: z.string().cuid('Invalid session ID format')
});

// Verify certificate validation
const verifyCertificateSchema = z.object({
  certCode: z.string()
    .regex(/^CERT-[A-F0-9]{16}$/, 'Invalid certificate code format')
});

// Certificate filters validation
const certificateFiltersSchema = z.object({
  userId: z.string().cuid().optional(),
  sessionId: z.string().cuid().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional()
});

module.exports = {
  issueCertificateSchema,
  verifyCertificateSchema,
  certificateFiltersSchema
};