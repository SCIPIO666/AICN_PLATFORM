const express = require('express');
const authRouter = express.Router();
const authController = require('../modules/auth/authController');
const { findAllUsers } = require('../modules/users/usersModel');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const  validate  = require('../middleware/validate');

// validation schemas
const { 
  signupSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema
} = require('../../shared/validators/authValidation');


// ============ PUBLIC ROUTES (No authentication required) ============

// POST /signup - User registration
authRouter.post(
  '/signup', 
  validate(signupSchema, 'body'),  
  authController.signup
);

// POST /login - User login
authRouter.post(
  '/login', 
  validate(loginSchema, 'body'), 
  authController.login
);

// POST /forgot-password - Request password reset
authRouter.post(
  '/forgot-password', 
  validate(forgotPasswordSchema, 'body'),  
  authController.forgotPassword
);

// POST /reset-password - Reset password with token
authRouter.post(
  '/reset-password', 
  validate(resetPasswordSchema, 'body'),  
  authController.resetPassword
);

// ============ PROTECTED ROUTES (Authentication required) ============

// POST /signout - Logout user
authRouter.post(
  '/signout', 
  verifyToken, 
  authController.signout
);

// GET /me - Get current user info
authRouter.get(
  '/me', 
  verifyToken, 
  authController.me
);

// POST /change-password - Change password (authenticated)
authRouter.post(
  '/change-password', 
  verifyToken,
  validate(changePasswordSchema, 'body'),  // ADD VALIDATION
  authController.changePassword
);

// POST /refresh-token - Refresh access token
authRouter.post(
  '/refresh-token', 
  // verifyToken,
  validate(refreshTokenSchema, 'body'),  
  authController.refreshToken
);

// ============ ADMIN ROUTES ============
// GET /users - Get all users (admin only)
authRouter.get(
  '/users', 
  verifyToken, 
  requireRole(['ADMIN']), 
  async (req, res) => {
    const users = await findAllUsers();
    res.json({ success: true, data: users });
  }
);

module.exports = authRouter;