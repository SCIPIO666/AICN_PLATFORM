const { z } = require('zod');
const { TrainerStatusValues } = require('../constants/enums');

// Create trainer profile validation
const createTrainerProfileSchema = z.object({
  bio: z.string()
    .max(1000, 'Bio must not exceed 1000 characters')
    .optional(),
  
  skills: z.array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Cannot have more than 20 skills'),
  
  availability: z.string()
    .max(200, 'Availability info must not exceed 200 characters')
    .optional(),
  
  motivation: z.string()
    .max(1000, 'Motivation statement must not exceed 1000 characters')
    .optional()
});

// Update trainer profile validation
const updateTrainerProfileSchema = z.object({
  bio: z.string()
    .max(1000, 'Bio must not exceed 1000 characters')
    .optional(),
  
  skills: z.array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Cannot have more than 20 skills')
    .optional(),
  
  availability: z.string()
    .max(200, 'Availability info must not exceed 200 characters')
    .optional(),
  
  motivation: z.string()
    .max(1000, 'Motivation statement must not exceed 1000 characters')
    .optional()
});

// Admin update trainer status validation
const updateTrainerStatusSchema = z.object({
  status: z.enum(TrainerStatusValues)
});

// Trainer filters validation
const trainerFiltersSchema = z.object({
  status: z.enum(TrainerStatusValues).optional(),
  skill: z.string().optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional()
});

module.exports = {
  createTrainerProfileSchema,
  updateTrainerProfileSchema,
  updateTrainerStatusSchema,
  trainerFiltersSchema
};