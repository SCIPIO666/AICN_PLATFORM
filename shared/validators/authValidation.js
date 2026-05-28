const { z } = require('zod');
const { RoleValues } = require('../constants/enums');

// Phone number regex (Kenyan format example)
const phoneRegex = /^\+?254[0-9]{9}$|^0[0-9]{9}$/;

// Password schema (reusable)
const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Signup validation
const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase(), // Normalize email to lowercase
  
  password: passwordSchema,
  
  phone: z.string()
    .regex(phoneRegex, 'Invalid phone number format. Use format: 0712345678 or +254712345678')
    .optional()
    .nullable(),
  
  county: z.string()
    .min(2, 'County must be at least 2 characters')
    .max(50, 'County must not exceed 50 characters')
    .optional()
    .nullable(),
  
  role: z.enum(RoleValues).default('LEARNER').optional()
});

// Login validation
const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(), // Normalize email
  
  password: z.string()
    .min(1, 'Password is required')
});

// Change password validation
const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  
  newPassword: passwordSchema,
  
  confirmPassword: z.string()
    .min(1, 'Please confirm your new password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword']
});

// Forgot password validation
const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
});

// Reset password validation
const resetPasswordSchema = z.object({
  token: z.string()
    .min(10, 'Invalid reset token format')
    .max(500, 'Reset token is too long'),
  
  newPassword: passwordSchema,
  
  confirmPassword: z.string()
    .min(1, 'Please confirm your new password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

// Refresh token validation
const refreshTokenSchema = z.object({
  token: z.string()
    .min(10, 'Invalid token format')
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'Invalid JWT token format')
});

// Update profile validation
const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  
  phone: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .optional()
    .nullable(),
  
  county: z.string()
    .min(2, 'County must be at least 2 characters')
    .max(50, 'County must not exceed 50 characters')
    .optional()
    .nullable()
});

// Token header validation (for routes that need token in body/header)
const tokenHeaderSchema = z.object({
  authorization: z.string()
    .regex(/^Bearer\s+[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'Invalid authorization header format')
});

module.exports = {
  signupSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  refreshTokenSchema,
  tokenHeaderSchema,
  passwordSchema 
};