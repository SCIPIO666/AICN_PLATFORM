const { z } = require('zod');
const { SessionStatusValues, LocationTypeValues } = require('../constants/enums');

// Create session validation
const createSessionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  skillArea: z.string()
    .min(2, 'Skill area must be at least 2 characters')
    .max(100, 'Skill area must not exceed 100 characters'),
  
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  
  date: z.string()
    .datetime({ message: 'Invalid date format' })
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
    .refine(val => {
      if (!val) return true;
      // If online, validate URL; if physical, validate address
      return true; // Add specific validation based on locationType
    }, 'Invalid venue format'),
  
  county: z.string()
    .min(2, 'County must be at least 2 characters')
    .max(50, 'County must not exceed 50 characters')
    .optional(),
  
  capacity: z.number()
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must not exceed 100')
    .default(30),
  
  trainerId: z.string().cuid('Invalid trainer ID format').optional()
});

// Update session validation
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
    .optional(),
  
  date: z.string()
    .datetime({ message: 'Invalid date format' })
    .optional(),
  
  durationMins: z.number()
    .int('Duration must be an integer')
    .min(30, 'Duration must be at least 30 minutes')
    .max(480, 'Duration must not exceed 480 minutes')
    .optional(),
  
  locationType: z.enum(LocationTypeValues).optional(),
  
  venue: z.string()
    .min(3, 'Venue must be at least 3 characters')
    .max(500, 'Venue must not exceed 500 characters')
    .optional(),
  
  county: z.string()
    .min(2, 'County must be at least 2 characters')
    .max(50, 'County must not exceed 50 characters')
    .optional(),
  
  capacity: z.number()
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must not exceed 100')
    .optional(),
  
  status: z.enum(SessionStatusValues).optional(),
  
  trainerId: z.string().cuid('Invalid trainer ID format').optional()
});

// Session filters validation
const sessionFiltersSchema = z.object({
  status: z.enum(SessionStatusValues).optional(),
  skillArea: z.string().optional(),
  locationType: z.enum(LocationTypeValues).optional(),
  county: z.string().optional(),
  trainerId: z.string().cuid().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional()
});

module.exports = {
  createSessionSchema,
  updateSessionSchema,
  sessionFiltersSchema
};