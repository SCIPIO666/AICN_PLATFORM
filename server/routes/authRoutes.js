const express = require('express');
const authRouter = express.Router();
const authController = require('./authController');
const {findAllUsers}=require('../modules/users/usersModel')
const { verifyToken, requireRole } = require('../../middleware/authMiddleware');

// Public routes
authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
authRouter.post('/signout', verifyToken, authController.signout);
authRouter.get('/me', verifyToken, authController.me);
authRouter.post('/change-password', verifyToken, authController.changePassword);
authRouter.post('/refresh-token', verifyToken, authController.refreshToken);

// Admin only routes
authRouter.get('/users', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    // Get all users (admin only)
    const users = await findAllUsers();
    res.json({ success: true, data: users });
});

module.exports = authRouter;