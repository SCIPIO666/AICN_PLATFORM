const { z } = require('zod');

/**
 * Generic validation middleware for Express routes using Zod schemas
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {string} property - Which request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      // Validate the request data against the schema
      const validatedData = schema.parse(req[property]);
      
      // Replace the request property with validated data
      req[property] = validatedData;
      
      // Proceed to next middleware/controller
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received || undefined,
          expected: err.expected || undefined
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors
        });
      }
      
      // Handle other errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Validate request body only
 * @param {z.ZodSchema} schema 
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => validate(schema, 'body');

/**
 * Validate query parameters only
 * @param {z.ZodSchema} schema 
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validate route parameters only
 * @param {z.ZodSchema} schema 
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => validate(schema, 'params');

/**
 * Validate multiple request properties at once
 * @param {Object} schemas - Object with keys 'body', 'query', 'params' and Zod schema values
 * @returns {Function} Express middleware
 */
const validateMultiple = (schemas) => {
  return (req, res, next) => {
    const errors = [];
    const validatedData = {};
    
    for (const [property, schema] of Object.entries(schemas)) {
      if (!schema) continue;
      
      try {
        const parsed = schema.parse(req[property]);
        validatedData[property] = parsed;
        req[property] = parsed;
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            errors.push({
              property: property,
              field: err.path.join('.'),
              message: err.message,
              received: err.received || undefined,
              expected: err.expected || undefined
            });
          });
        } else {
          errors.push({
            property: property,
            message: 'Invalid validation schema'
          });
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // Attach validated data to request for use in controllers
    req.validated = validatedData;
    next();
  };
};

/**
 * ID validator that works with both Prisma PostgreSQL (Int) and MongoDB (String/CUID)
 * Auto-detects and validates based on your schema
 */
const validatePrismaId = (fieldName = 'id') => {
  return (req, res, next) => {
    const id = req.params[fieldName];
    
    // Check if ID exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `${fieldName} is required`
      });
    }
    
    // For MongoDB with Prisma (usually CUID or String)
    // For PostgreSQL with Prisma (usually Int)
    const isNumericId = /^\d+$/.test(id);
    
    if (isNumericId) {
      // PostgreSQL integer ID
      const numId = parseInt(id, 10);
      if (isNaN(numId) || numId <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${fieldName}. Must be a positive integer`
        });
      }
      req.validatedId = numId;
    } else {
      // MongoDB/CUID string ID
      if (id.length < 5 || id.length > 50) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${fieldName} format`
        });
      }
      req.validatedId = id;
    }
    
    req.params[fieldName] = req.validatedId;
    next();
  };
};

/**
 * Pagination schema that works for both PostgreSQL and MongoDB
 */
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().positive().max(100).optional(),
  cursor: z.string().optional(), // For MongoDB cursor-based pagination
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional()
});

/**
 * Common ID parameter schema that works with both DBs
 * Accepts both integer (PostgreSQL) and string/CUID (MongoDB)
 */
const idParamSchema = z.object({
  id: z.string()
    .min(1, 'ID is required')
    .refine((val) => {
      // Valid if it's either:
      // 1. A positive integer (PostgreSQL)
      // 2. A non-empty string with length between 5-50 (MongoDB CUID)
      const isNumeric = /^\d+$/.test(val);
      if (isNumeric) {
        return parseInt(val, 10) > 0;
      }
      return val.length >= 5 && val.length <= 50;
    }, {
      message: 'Invalid ID format. Must be a positive integer (PostgreSQL) or valid CUID (MongoDB)'
    })
});

/**
 * CUID validator specifically for MongoDB with Prisma
 */
const cuidSchema = z.string().cuid('Invalid CUID format. Must be a valid CUID (e.g., ck7x9x9x90000xxx)');

/**
 * Integer ID validator for PostgreSQL
 */
const intIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer')
});

module.exports = {
  // Main validators
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateMultiple,
  validatePrismaId,
  
  // Reusable schemas
  paginationSchema,
  idParamSchema,
  cuidSchema,
  intIdSchema,
  
  // Helper function to create custom ID validators
  createIdValidator: (type = 'auto') => {
    if (type === 'int') return intIdSchema;
    if (type === 'cuid') return z.object({ id: cuidSchema });
    return idParamSchema;
  }
};