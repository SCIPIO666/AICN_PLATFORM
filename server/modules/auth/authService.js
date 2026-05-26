const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../../config/db');
const logger = require('../../utils/logger');
const { 
    sendWelcomeEmail, 
    sendPasswordResetEmail 
} = require('../../utils/email/email services/aicnEmailsService');
const {
    findUser,
    findUserById,
    findManyUsers,
    findAllUsers,
    updateUser,
    deleteUser,
    createUser,
    findUserWithPassword,
    updateUserPassword,
    countUsers
} = require('../users/usersModel');

/**
 * Login user
 */
async function login(email, password) {
    try {
        const user = await findUserWithPassword(email);
        if (!user) throw new Error('Invalid credentials');
        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid password');
        }
        
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...safeUser } = user;
        
        return {
            user: safeUser,
            token,
            expiresIn: 7 * 24 * 60 * 60 * 1000
        };
    } catch (error) {
        logger.error(`Login failed for ${email}: ${error.message}`);
        throw new Error('Invalid email or password');
    }
}

/**
 * Signout user
 */
async function signout(token, userId) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiresAt = new Date(decoded.exp * 1000);
        
        await prisma.blacklistedToken.create({
            data: {
                token,
                userId: userId || decoded.userId,
                expiresAt
            }
        });
        
        await cleanupExpiredTokens().catch(err => logger.error('Cleanup failed:', err.message));
        
        return {
            success: true,
            message: 'Successfully signed out'
        };
    } catch (error) {
        logger.error(error.message);
        throw error;
    }
}

/**
 * Signup new user with welcome email
 */
async function signup(name, email, password, phone, county) {
    try {
        // Check for existing user
        const existingUser = await findUser(email);
        if (existingUser) {
            if (existingUser.deletedAt) {
                throw new Error('This email was previously deactivated. Please contact support.');
            }
            throw new Error(`User with email ${email} already exists`);
        }
        
        // Create new user
        const newUser = await createUser(name, email, password, phone, county);
        
        // Send welcome email (non-blocking)
        sendWelcomeEmail({
            to: newUser.email,
            name: newUser.name,
            role: newUser.role || 'USER',
            tempPassword: null,
            frontendUrl: process.env.FRONTEND_URL,
            supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
            year: new Date().getFullYear()
        }).catch(err => {
            logger.error(`Failed to send welcome email to ${newUser.email}:`, {
                error: err.message,
                userId: newUser.id,
                email: newUser.email
            });
        });
        
        logger.info(`New user registered: ${newUser.email} (ID: ${newUser.id})`);
        
        // Return user without password
        const { password: _, ...safeUser } = newUser;
        return safeUser;
    } catch (error) {
        logger.error(`Signup failed for ${email}: ${error.message}`);
        throw error;
    }
}

/**
 * Get current user info
 */
async function me(userId) {
    try {
        const user = await findUserById(userId);
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        logger.error(`Get user failed for ${userId}: ${error.message}`);
        throw error;
    }
}

/**
 * Cleanup expired tokens from blacklist
 */
async function cleanupExpiredTokens() {
    try {
        const result = await prisma.blacklistedToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
        
        if (result.count > 0) {
            logger.info(`Cleaned up ${result.count} expired blacklisted tokens`);
        }
        
        return result;
    } catch (error) {
        logger.error(`Token cleanup failed: ${error.message}`);
        throw error;
    }
}

/**
 * Request password reset
 */
async function forgotPassword(email) {
    try {
        // Find user
        const user = await findUser(email);
        if (!user) {
            // Don't reveal that user doesn't exist for security
            return { success: true, message: 'If email exists, reset link will be sent' };
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour
        
        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }
        });
        
        // Send password reset email (non-blocking but await for error handling)
        try {
            await sendPasswordResetEmail({
                to: user.email,
                name: user.name,
                resetToken: resetToken,
                expiryHours: 1,
                frontendUrl: process.env.FRONTEND_URL,
                supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
                year: new Date().getFullYear()
            });
            
            logger.info(`Password reset email sent to ${user.email}`);
        } catch (emailError) {
            logger.error(`Failed to send password reset email to ${user.email}:`, emailError);
            // Still return success for security, but log the error
        }
        
        return { success: true, message: 'Password reset email sent' };
    } catch (error) {
        logger.error(`Forgot password failed for ${email}: ${error.message}`);
        throw error;
    }
}

/**
 * Reset password with token
 */
async function resetPassword(token, newPassword) {
    try {
        // Find user by valid token
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date()
                }
            }
        });
        
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password and clear reset fields
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
        
        logger.info(`Password reset successful for ${user.email}`);
        
        return { success: true, message: 'Password has been reset' };
    } catch (error) {
        logger.error(`Reset password failed: ${error.message}`);
        throw error;
    }
}

/**
 * Change password (authenticated user)
 */
async function changePassword(userId, currentPassword, newPassword) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true, email: true }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        
        logger.info(`Password changed for user ${user.email}`);
        
        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        logger.error(`Change password failed for user ${userId}: ${error.message}`);
        throw error;
    }
}

/**
 * Refresh token
 */
async function refreshToken(oldToken) {
    try {
        // Verify old token
        const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
        
        // Check if token is blacklisted
        const blacklisted = await prisma.blacklistedToken.findFirst({
            where: { token: oldToken }
        });
        
        if (blacklisted) {
            throw new Error('Token has been invalidated');
        }
        
        // Generate new token
        const tokenPayload = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        
        const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // Blacklist old token
        await prisma.blacklistedToken.create({
            data: {
                token: oldToken,
                userId: decoded.userId,
                expiresAt: new Date(decoded.exp * 1000)
            }
        });
        
        return {
            token: newToken,
            expiresIn: 7 * 24 * 60 * 60 * 1000
        };
    } catch (error) {
        logger.error(`Token refresh failed: ${error.message}`);
        throw error;
    }
}

module.exports = {
    login,
    signout,
    signup,
    me,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    cleanupExpiredTokens
};
