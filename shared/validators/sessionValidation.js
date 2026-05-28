const { z } = require('zod');
const { SessionStatusValues, LocationTypeValues } = require('../constants/enums');

// ID param validation (ADD THIS)
const idParamSchema = z.object({
  id: z.string()
    .cuid('Invalid session ID format - must be a valid CUID')
    .or(z.string().uuid('Invalid session ID format - must be a valid UUID'))
});

// Conditional venue validation helper
const venueSchema = z.string()
  .min(3, 'Venue must be at least 3 characters')
  .max(500, 'Venue must not exceed 500 characters');

// Create session validation (IMPROVED)
const createSessionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  skillArea: z.string()
    .min(2, 'Skill area must be at least 2 characters')
    .max(100, 'Skill area must not exceed 100 characters'),
  
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .nullable(),
  
  date: z.string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .refine(date => new Date(date) > new Date(), {
      message: 'Session date must be in the future'
    }),
  
  durationMins: z.number()
    .int('Duration must be an integer')
    .min(30, 'Duration must be at least 30 minutes')
    .max(480, 'Duration must not exceed 480 minutes (8 hours)')
    .default(120),
  
  locationType: z.enum(LocationTypeValues).default('PHYSICAL'),
  
  venue: z.string()
    .min(3, 'Venue must be at least 3 characters')
    .max(500, 'Venue must not exceed 500 characters')
    .optional()
    .nullable(),
  
  meetingLink: z.string()
    .url('Must be a valid URL for online sessions')
    .optional()
    .nullable()
    .refine(val => {
      // If locationType is ONLINE, meeting link is required
      return true; // Handled by refine below
    }, 'Meeting link is required for online sessions'),
  
  county: z.string()
    .min(2, 'County must be at least 2 characters')
    .max(50, 'County must not exceed 50 characters')
    .optional()
    .nullable(),
  
  capacity: z.number()
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must not exceed 100')
    .default(30),
  
  trainerId: z.string()
    .cuid('Invalid trainer ID format')
    .or(z.string().uuid('Invalid trainer ID format'))
    .optional()
    .nullable()
}).refine(data => {
  // If locationType is 'ONLINE', meetingLink is required
  if (data.locationType === 'ONLINE' && !data.meetingLink) {
    return false;
  }
  // If locationType is 'PHYSICAL', venue is required
  if (data.locationType === 'PHYSICAL' && !data.venue) {
    return false;
  }
  return true;
}, {
  message: "Physical sessions require a venue, online sessions require a meeting link",
  path: ["locationType"]
});

// Update session validation (IMPROVED)
const updateSessionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  
  skillArea: z.string()
    .min(2, 'Skill area must be at least 2 characters')
    .max(100, 'Skill area must not exceed 100 characters')
    .optional(),
  
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .nullable(),
  
  date: z.string()
    .datetime({ message: 'Invalid date format' })
    .optional()
    .refine(date => {
      if (!date) return true;
      return new Date(date) > new Date();
    }, {
      message: 'Session date must be in the future'
    }),
  
  durationMins: z.number()
    .int('Duration must be an integer')
    .min(30, 'Duration must be at least 30 minutes')
    .max(480, 'Duration must not exceed 480 minutes')
    .optional(),
  
  locationType: z.enum(LocationTypeValues).optional(),
  
  venue: z.string()
    .min(3, 'Venue must be at least 3 characters')
    .max(500, 'Venue must not exceed 500 characters')
    .optional()
    .nullable(),
  
  meetingLink: z.string()
    .url('Must be a valid URL for online sessions')
    .optional()
    .nullable(),
  
  county: z.string()
    .min(2, 'County must be at least 2 characters')
    .max(50, 'County must not exceed 50 characters')
    .optional()
    .nullable(),
  
  capacity: z.number()
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must not exceed 100')
    .optional(),
  
  status: z.enum(SessionStatusValues).optional(),
  
  trainerId: z.string()
    .cuid('Invalid trainer ID format')
    .or(z.string().uuid('Invalid trainer ID format'))
    .optional()
    .nullable()
}).refine(data => {
  // Conditional validation only if locationType is being updated
  if (data.locationType === 'ONLINE' && data.meetingLink === undefined && data.venue === undefined) {
    // If changing to online, either meetingLink must be provided or venue removed
    return true; // Pass to service layer for existing data check
  }
  if (data.locationType === 'PHYSICAL' && data.venue === undefined && data.meetingLink === undefined) {
    return true;
  }
  return true;
});

// Session filters validation (with upcoming special handling)
const sessionFiltersSchema = z.object({
  status: z.enum(SessionStatusValues).optional(),
  skillArea: z.string().optional(),
  locationType: z.enum(LocationTypeValues).optional(),
  county: z.string().optional(),
  trainerId: z.string()
    .cuid()
    .or(z.string().uuid())
    .optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  upcoming: z.enum(['true', 'false']).optional(), // Special filter
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

// Enhanced filters schema for internal use (after processing)
const processedFiltersSchema = z.object({
  status: z.enum(SessionStatusValues).optional(),
  skillArea: z.string().optional(),
  locationType: z.enum(LocationTypeValues).optional(),
  county: z.string().optional(),
  trainerId: z.string().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
});

module.exports = {
  idParamSchema,
  createSessionSchema,
  updateSessionSchema,
  sessionFiltersSchema,
  processedFiltersSchema
};