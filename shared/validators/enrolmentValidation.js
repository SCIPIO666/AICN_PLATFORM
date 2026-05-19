const { z } = require('zod');
const { EnrolmentStatusValues } = require('../constants/enums');

// Create enrolment validation
const createEnrolmentSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID format')
});

// Update enrolment validation
const updateEnrolmentSchema = z.object({
  status: z.enum(EnrolmentStatusValues)
    .refine(val => val !== 'ENROLLED', {
      message: 'Cannot update to ENROLLED status. Use create endpoint for new enrolments.'
    })
});

// Enrolment filters validation
const enrolmentFiltersSchema = z.object({
  userId: z.string().cuid().optional(),
  sessionId: z.string().cuid().optional(),
  status: z.enum(EnrolmentStatusValues).optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional()
});

// Bulk enrolment validation
const bulkEnrolmentSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID format'),
  userIds: z.array(z.string().cuid())
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot enrol more than 100 users at once')
});

module.exports = {
  createEnrolmentSchema,
  updateEnrolmentSchema,
  enrolmentFiltersSchema,
  bulkEnrolmentSchema
};