const { z } = require('zod');

// Common pagination schema
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional()
});

// Common ID schema
const idSchema = z.object({
  id: z.string().cuid({ message: 'Invalid ID format' })
});

// Common date range schema
const dateRangeSchema = z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional()
}).refine(data => {
  if (data.fromDate && data.toDate) {
    return new Date(data.fromDate) <= new Date(data.toDate);
  }
  return true;
}, {
  message: 'fromDate must be before or equal to toDate'
});

// Common response schema (for documentation)
const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional()
});

const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  message: z.string(),
  statusCode: z.number().int()
});

module.exports = {
  paginationSchema,
  idSchema,
  dateRangeSchema,
  successResponseSchema,
  errorResponseSchema
};