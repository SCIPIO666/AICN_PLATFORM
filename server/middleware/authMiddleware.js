const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    const token =authHeader?.startsWith('Bearer ')? authHeader.split(' ')[1]: null;


    if (!token) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check blacklist
    const isBlacklisted =
      await prisma.blacklistedToken.findUnique({
        where: { token }
      });

    if (isBlacklisted) {
      return res.status(401).json({
        error:
          'Token has been revoked. Please login again.'
      });
    }
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      error: `Invalid or expired token : ${error.message}`
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};