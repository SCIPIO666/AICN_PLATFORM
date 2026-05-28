const logger = require('../../utils/logger');
const authService = require('./authService');

/**
 * Signup controller
 * NOTE: Request body is already validated by middleware
 */
async function signup(req, res, next) {
    try {
        const { name, email, password, phone, county, role } = req.body;
        
        const user = await authService.signup(name, email, password, phone, county, role);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for confirmation.',
            data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } }
        });
    } catch (error) {
        logger.error(`Signup controller error: ${error.message}`);
        
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes('deactivated')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        
        next(error); 
    }
}

/**
 * Login controller
 * NOTE: Request body is already validated by middleware
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        
        const result = await authService.login(email, password);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        logger.error(`Login controller error: ${error.message}`);
        
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid credentials'
        });
    }
}

/**
 * Signout controller
 */
async function signout(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }
        
        const result = await authService.signout(token, req.user?.id);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        logger.error(`Signout controller error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to sign out'
        });
    }
}

/**
 * Get current user controller
 */
async function me(req, res, next) {
    try {
        const user = await authService.me(req.user.id);
        
        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        logger.error(`Get user controller error: ${error.message}`);
        res.status(404).json({
            success: false,
            message: error.message || 'User not found'
        });
    }
}

/**
 * Forgot password controller
 * NOTE: Request body is already validated by middleware
 */
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        
        const result = await authService.forgotPassword(email);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        logger.error(`Forgot password controller error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process password reset'
        });
    }
}

/**
 * Reset password controller
 * NOTE: Request body is already validated by middleware
 */
async function resetPassword(req, res, next) {
    try {
        const { token, newPassword } = req.body;
        
        const result = await authService.resetPassword(token, newPassword);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        logger.error(`Reset password controller error: ${error.message}`);
        
        if (error.message.includes('Invalid or expired')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reset password'
        });
    }
}

/**
 * Change password controller (authenticated)
 * NOTE: Request body is already validated by middleware
 */
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        const result = await authService.changePassword(userId, currentPassword, newPassword);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        logger.error(`Change password controller error: ${error.message}`);
        
        if (error.message.includes('Current password is incorrect')) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to change password'
        });
    }
}

/**
 * Refresh token controller
 * NOTE: Token can come from body or header
 */
async function refreshToken(req, res, next) {
    try {
        // Try to get token from body first, then from header
        let token = req.body.token;
        
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }
        
        const result = await authService.refreshToken(token);
        
        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: result
        });
    } catch (error) {
        logger.error(`Refresh token controller error: ${error.message}`);
        res.status(401).json({
            success: false,
            message: error.message || 'Failed to refresh token'
        });
    }
}

module.exports = {
    signup,
    login,
    signout,
    me,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken
};