// authRouter.js
const express = require('express');
const authRouter = express.Router();
const authController = require('../modules/auth/authController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');


authRouter.post('/signup', authController.signup);

authRouter.post('/login', authController.login);

authRouter.post('/signout', verifyToken, authController.signout);

authRouter.get('/me', verifyToken, authController.me);

module.exports = authRouter;