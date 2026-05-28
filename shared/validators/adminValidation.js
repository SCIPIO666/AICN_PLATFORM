const { z } = require('zod');
const {  RoleValues } = require('../constants/enums');

// User filters for GET /users
const userFiltersSchema = z.object({
  role: z.enum(['LEARNER', 'TRAINER', 'ADMIN']).optional(),
  search: z.string().min(1).max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

// Update user role schema
const updateUserRoleSchema = z.object({
  newRole: z.enum(['LEARNER', 'TRAINER', 'ADMIN'], {
    errorMap: () => ({ message: 'Role must be one of: LEARNER, TRAINER, ADMIN' })
  }),
  approvalMessage: z.string().max(500).optional(),
  rejectionReason: z.string().max(500).optional(),
  isRejection: z.boolean().default(false)
}).refine(
  (data) => {
    // If isRejection is true, rejectionReason is required
    if (data.isRejection && !data.rejectionReason) {
      return false;
    }
    // If isRejection is false and approvalMessage is provided, it's fine
    return true;
  },
  {
    message: "Rejection reason is required when isRejection is true",
    path: ["rejectionReason"]
  }
);

// ID param schema (reuse or create)
const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format - must be a valid UUID'),
  userId: z.string().uuid('Invalid user ID format - must be a valid UUID')
});

module.exports = {
  userFiltersSchema,
  updateUserRoleSchema,
  idParamSchema
};