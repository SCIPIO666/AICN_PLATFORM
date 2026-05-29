
const logger = require('../utils/logger');
const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    ip: req.ip
  });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.errorCode,
      ...(err.errors && { details: err.errors })
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message || 'An error occurred';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

function handlePrismaError(err, res) {
  switch (err.code) {
    case 'P2002':
      return res.status(409).json({
        success: false,
        message: `Duplicate field value: ${err.meta?.target?.join(', ')}`,
        code: 'DUPLICATE_ERROR'
      });
    case 'P2025':
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        code: 'NOT_FOUND'
      });
    case 'P2003':
      return res.status(400).json({
        success: false,
        message: 'Invalid reference to related record',
        code: 'FOREIGN_KEY_ERROR'
      });
    default:
      return res.status(500).json({
        success: false,
        message: 'Database error occurred',
        code: 'DATABASE_ERROR'
      });
  }
}

module.exports = errorHandler;