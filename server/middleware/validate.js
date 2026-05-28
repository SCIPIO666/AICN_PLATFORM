
const { z } = require('zod');
const logger=require('../../server/utils/logger')
/**
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {string} property - Which request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {

      const validatedData = schema.parse(req[property]);
      req[property] = validatedData;
      
      next();
    } catch (error) {
    // validation errors
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
      
      // other errors
      logger.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};

module.exports = validate;