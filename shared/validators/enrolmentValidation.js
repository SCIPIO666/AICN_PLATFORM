const { z } = require('zod');
const { EnrolmentStatusValues } = require('../constants/enums');

// ID param validation (add this)
const idParamSchema = z.object({
  id: z.string()
    .cuid('Invalid enrolment ID format - must be a valid CUID')
    .or(z.string().uuid('Invalid enrolment ID format - must be a valid UUID'))
});

// Create enrolment validation
const createEnrolmentSchema = z.object({
  sessionId: z.string()
    .cuid('Invalid session ID format - must be a valid CUID')
    .or(z.string().uuid('Invalid session ID format - must be a valid UUID'))
});

// Update enrolment status validation (for admin/trainer updates)
const updateEnrolmentSchema = z.object({
  status: z.enum(EnrolmentStatusValues)
    .refine(val => val !== 'ENROLLED', {
      message: 'Cannot update to ENROLLED status. Use create endpoint for new enrolments.'
    })
});

// Mark attendance validation (NEW)
const markAttendanceSchema = z.object({
  status: z.enum(['ATTENDED', 'ABSENT'], {
    errorMap: () => ({ message: 'Attendance status must be either ATTENDED or ABSENT' })
  })
});

// Enrolment filters validation (for GET /me and admin endpoints)
const enrolmentFiltersSchema = z.object({
  userId: z.string()
    .cuid()
    .or(z.string().uuid())
    .optional(),
  sessionId: z.string()
    .cuid()
    .or(z.string().uuid())
    .optional(),
  status: z.enum(EnrolmentStatusValues).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional()
});

// Bulk enrolment validation
const bulkEnrolmentSchema = z.object({
  sessionId: z.string()
    .cuid('Invalid session ID format')
    .or(z.string().uuid('Invalid session ID format')),
  userIds: z.array(
    z.string().cuid().or(z.string().uuid())
  )
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot enrol more than 100 users at once')
});

// Cancel enrolment validation (optional reason)
const cancelEnrolmentSchema = z.object({
  reason: z.string()
    .min(3, 'Cancellation reason must be at least 3 characters')
    .max(500, 'Cancellation reason must not exceed 500 characters')
    .optional()
});

module.exports = {
  idParamSchema,
  createEnrolmentSchema,
  updateEnrolmentSchema,
  markAttendanceSchema,
  enrolmentFiltersSchema,
  bulkEnrolmentSchema,
  cancelEnrolmentSchema
};