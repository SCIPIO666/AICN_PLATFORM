const { z } = require('zod');
const { TrainerStatusValues,TrainerApprovalStatusValues } = require('../constants/enums');

// ID param validation
const idParamSchema = z.object({
  id: z.string()
    .cuid('Invalid trainer application ID format - must be a valid CUID')
    .or(z.string().uuid('Invalid trainer application ID format - must be a valid UUID'))
});

// Create trainer profile validation
const createTrainerProfileSchema = z.object({
  bio: z.string()
    .max(1000, 'Bio must not exceed 1000 characters')
    .optional()
    .nullable(),
  
  skills: z.array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Cannot have more than 20 skills'),
  
  availability: z.string()
    .max(200, 'Availability info must not exceed 200 characters')
    .optional()
    .nullable(),
  
  motivation: z.string()
    .max(1000, 'Motivation statement must not exceed 1000 characters')
    .optional()
    .nullable()
});

// Update trainer profile validation
const updateTrainerProfileSchema = z.object({
  bio: z.string()
    .max(1000, 'Bio must not exceed 1000 characters')
    .optional()
    .nullable(),
  
  skills: z.array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Cannot have more than 20 skills')
    .optional(),
  
  availability: z.string()
    .max(200, 'Availability info must not exceed 200 characters')
    .optional()
    .nullable(),
  
  motivation: z.string()
    .max(1000, 'Motivation statement must not exceed 1000 characters')
    .optional()
    .nullable()
});

// Admin update trainer status validation
const updateTrainerStatusSchema = z.object({
  status: z.enum(TrainerStatusValues),
  
});

// Rejection validation 
const rejectionSchema = z.object({
  reason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must not exceed 500 characters')
    .optional(),
  
  feedback: z.string()
    .max(1000, 'Feedback must not exceed 1000 characters')
    .optional()
});
const approvalSchema = z.object({
  message: z.string()
    .max(1000, 'Message must not exceed 1000 characters')
    .optional()
});

// Trainer filters validation 
const trainerFiltersSchema = z.object({
  status: z.enum(TrainerStatusValues).optional(),
  skill: z.string()
    .min(1, 'Skill filter must be at least 1 character')
    .max(50, 'Skill filter must not exceed 50 characters')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string()
    .min(1, 'Search term must be at least 1 character')
    .max(100, 'Search term must not exceed 100 characters')
    .optional()
});

// Session filters for trainer sessions (ADD THIS)
const trainerSessionFiltersSchema = z.object({
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

module.exports = {
  idParamSchema,
  createTrainerProfileSchema,
  updateTrainerProfileSchema,
  updateTrainerStatusSchema,
  rejectionSchema,
  trainerFiltersSchema,
  approvalSchema,
  trainerSessionFiltersSchema
};