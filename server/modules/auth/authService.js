
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {prisma} = require('../../config/db');
const logger = require('../../utils/logger');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../../utils/email/email services/aicnEmailsService');
const { findUser, findUserById, createUser, findUserWithPassword } = require('../users/usersModel');
const { AuthenticationError, ConflictError, NotFoundError, BusinessLogicError } = require('../../utils/errors/customErrors');

async function login(email, password) {
  try {
    const user = await findUserWithPassword(email);
    if (!user) throw new AuthenticationError('Invalid email or password');
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthenticationError('Invalid email or password');
    }
    
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    
    return { user: safeUser, token, expiresIn: 7 * 24 * 60 * 60 * 1000 };
  } catch (error) {
    logger.error(`Login failed for ${email}: ${error.message}`);
    if (error instanceof AuthenticationError) throw error;
    throw new AuthenticationError('Invalid email or password');
  }
}

async function signout(token, userId) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);
    
    await prisma.blacklistedToken.create({ data: { token, userId: userId || decoded.userId, expiresAt } });
    await cleanupExpiredTokens().catch(err => logger.error('Cleanup failed:', err.message));
    
    return { success: true, message: 'Successfully signed out' };
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

async function signup(name, email, password, phone, county, role = 'LEARNER') {
  try {
    const existingUser = await findUser(email);
    if (existingUser) {
      if (existingUser.deletedAt) {
        throw new ConflictError('This email was previously deactivated. Please contact support.');
      }
      throw new ConflictError(`User with email ${email} already exists`);
    }
    
    const newUser = await createUser(name, email, password, phone, county, role);
    
    sendWelcomeEmail({
      to: newUser.email,
      name: newUser.name,
      role: newUser.role || 'USER',
      tempPassword: null,
      frontendUrl: process.env.FRONTEND_URL,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
      year: new Date().getFullYear()
    }).catch(err => logger.error(`Failed to send welcome email to ${newUser.email}:`, err));
    
    logger.info(`New user registered: ${newUser.email} (ID: ${newUser.id}, Role: ${newUser.role})`);
    
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  } catch (error) {
    logger.error(`Signup failed for ${email}: ${error.message}`);
    throw error;
  }
}

async function me(userId) {
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('User');
  
  const { password: _, ...safeUser } = user;
  return safeUser;
}

async function cleanupExpiredTokens() {
  try {
    const result = await prisma.blacklistedToken.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });
    if (result.count > 0) logger.info(`Cleaned up ${result.count} expired blacklisted tokens`);
    return result;
  } catch (error) {
    logger.error(`Token cleanup failed: ${error.message}`);
    throw error;
  }
}

async function forgotPassword(email) {
  try {
    const user = await findUser(email);
    if (!user) {
      return { success: true, message: 'If an account exists with this email, a password reset link will be sent.' };
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires }
    });
    
    sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetToken: resetToken,
      expiryHours: 1,
      frontendUrl: process.env.FRONTEND_URL,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
      year: new Date().getFullYear()
    }).catch(err => logger.error(`Failed to send password reset email to ${user.email}:`, err));
    
    return { success: true, message: 'If an account exists with this email, a password reset link will be sent.' };
  } catch (error) {
    logger.error(`Forgot password failed for ${email}: ${error.message}`);
    throw error;
  }
}

async function resetPassword(token, newPassword) {
  try {
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token, resetPasswordExpires: { gt: new Date() } }
    });
    
    if (!user) throw new BusinessLogicError('Invalid or expired reset token');
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }
    });
    
    logger.info(`Password reset successful for ${user.email}`);
    return { success: true, message: 'Password has been reset successfully' };
  } catch (error) {
    logger.error(`Reset password failed: ${error.message}`);
    throw error;
  }
}

async function changePassword(userId, currentPassword, newPassword) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, email: true }
    });
    
    if (!user) throw new NotFoundError('User');
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AuthenticationError('Current password is incorrect');
    
    if (newPassword.length < 6) throw new BusinessLogicError('New password must be at least 6 characters');
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
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

async function refreshToken(oldToken) {
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    
    const blacklisted = await prisma.blacklistedToken.findFirst({ where: { token: oldToken } });
    if (blacklisted) throw new AuthenticationError('Token has been invalidated');
    
    const tokenPayload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    await prisma.blacklistedToken.create({
      data: { token: oldToken, userId: decoded.userId, expiresAt: new Date(decoded.exp * 1000) }
    });
    
    logger.info(`Token refreshed for user ${decoded.email}`);
    return { token: newToken, expiresIn: 7 * 24 * 60 * 60 * 1000 };
  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    throw new AuthenticationError('Failed to refresh token');
  }
}

module.exports = {
  login, signout, signup, me, forgotPassword, resetPassword, changePassword, refreshToken, cleanupExpiredTokens
};