const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  // redact sensitive fields
  redact: {
    paths: [
      // Auth
      'password',
      'confirmPassword',
      'newPassword',
      'oldPassword',

      // Tokens
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'authorization',
      'Authorization',

      // Cookies / sessions
      'cookie',
      'cookies',
      'session',

      // User data
      'email',
      'phone',
      'ssn',
      'nationalId',

      // Nested request bodies
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.confirmPassword',
      'req.body.token',

      // Database secrets
      'database.password',
      'db.password',
    ],

    // placeholder for redacted info
    censor: '[REDACTED]',
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  base: {
    service: 'auth-service',
    env: process.env.NODE_ENV,
  },

  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },

  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,
});

module.exports = logger;