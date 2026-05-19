const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const logger = require('../utils/logger');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Training Management System API',
      version: '1.0.0',
      description: 'Complete API documentation for Training Sessions Management System including authentication, session management, enrolments, and certificates',
      contact: {
        name: 'API Support',
        email: 'support@trainingsystem.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
        description: 'Development server'
      },
      {
        url: process.env.PRODUCTION_URL || 'https://api.trainingsystem.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth_token',
          description: 'Authentication cookie'
        }
      },
      schemas: {
        // ==================== USER SCHEMAS ====================
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user_123456' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '+254712345678' },
            county: { type: 'string', example: 'Nairobi' },
            role: { type: 'string', enum: ['LEARNER', 'TRAINER', 'ADMIN'], example: 'LEARNER' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // ==================== AUTH SCHEMAS ====================
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone', 'county'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'password123' },
            phone: { type: 'string', example: '+254712345678' },
            county: { type: 'string', example: 'Nairobi' },
            role: { type: 'string', enum: ['LEARNER', 'TRAINER'], default: 'LEARNER' }
          }
        },
        
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' }
          }
        },
        
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            expiresIn: { type: 'integer', example: 604800000 }
          }
        },
        
        // ==================== SESSION SCHEMAS ====================
        Session: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'session_123456' },
            title: { type: 'string', example: 'Advanced JavaScript Workshop' },
            skillArea: { type: 'string', example: 'Programming' },
            description: { type: 'string', example: 'Deep dive into modern JavaScript features' },
            date: { type: 'string', format: 'date-time', example: '2024-12-15T10:00:00Z' },
            durationMins: { type: 'integer', example: 120, minimum: 30, maximum: 480 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'], example: 'ONLINE' },
            venue: { type: 'string', example: 'https://zoom.us/join/123456' },
            county: { type: 'string', example: 'Nairobi' },
            capacity: { type: 'integer', example: 30, minimum: 1, maximum: 100 },
            status: { type: 'string', enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'SCHEDULED' },
            trainerId: { type: 'string', example: 'user_123456' },
            trainer: { $ref: '#/components/schemas/User' },
            enrolledCount: { type: 'integer', example: 15 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['title', 'skillArea', 'date', 'durationMins', 'locationType', 'capacity']
        },
        
        CreateSessionInput: {
          type: 'object',
          required: ['title', 'skillArea', 'date', 'durationMins', 'locationType', 'capacity'],
          properties: {
            title: { type: 'string', example: 'Advanced JavaScript Workshop' },
            skillArea: { type: 'string', example: 'Programming' },
            description: { type: 'string', example: 'Deep dive into modern JavaScript features' },
            date: { type: 'string', format: 'date-time', example: '2024-12-15T10:00:00Z' },
            durationMins: { type: 'integer', example: 120, minimum: 30, maximum: 480 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'], example: 'ONLINE' },
            venue: { type: 'string', example: 'https://zoom.us/join/123456' },
            county: { type: 'string', example: 'Nairobi' },
            capacity: { type: 'integer', example: 30, minimum: 1, maximum: 100 },
            trainerId: { type: 'string', example: 'user_123456' }
          }
        },
        
        UpdateSessionInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Advanced JavaScript Workshop - Updated' },
            skillArea: { type: 'string', example: 'Programming' },
            description: { type: 'string', example: 'Updated description' },
            date: { type: 'string', format: 'date-time', example: '2024-12-16T10:00:00Z' },
            durationMins: { type: 'integer', example: 150 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'] },
            venue: { type: 'string', example: 'Nairobi Training Center' },
            county: { type: 'string', example: 'Nairobi' },
            capacity: { type: 'integer', example: 35 },
            status: { type: 'string', enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] }
          }
        },
        
        // ==================== ENROLMENT SCHEMAS ====================
        Enrolment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'enrolment_123456' },
            userId: { type: 'string', example: 'user_123456' },
            sessionId: { type: 'string', example: 'session_123456' },
            status: { type: 'string', enum: ['ENROLLED', 'ATTENDED', 'ABSENT', 'CANCELLED'], example: 'ENROLLED' },
            user: { $ref: '#/components/schemas/User' },
            session: { $ref: '#/components/schemas/Session' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        CreateEnrolmentInput: {
          type: 'object',
          required: ['sessionId'],
          properties: {
            sessionId: { type: 'string', example: 'session_123456' }
          }
        },
        
        UpdateEnrolmentInput: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ENROLLED', 'ATTENDED', 'ABSENT', 'CANCELLED'], example: 'ATTENDED' }
          }
        },
        
        // ==================== CERTIFICATE SCHEMAS ====================
        Certificate: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cert_123456' },
            userId: { type: 'string', example: 'user_123456' },
            sessionId: { type: 'string', example: 'session_123456' },
            certCode: { type: 'string', example: 'CERT-ABC123XYZ' },
            issuedAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
            session: { $ref: '#/components/schemas/Session' }
          }
        },
        
        // ==================== COMMON RESPONSES ====================
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message here' },
            statusCode: { type: 'integer', example: 400 }
          }
        },
        
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 100 },
                pages: { type: 'integer', example: 10 }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'No token provided', statusCode: 401 }
            }
          }
        },
        ForbiddenError: {
          description: 'User does not have required permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Access denied. Required role: ADMIN', statusCode: 403 }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Resource not found', statusCode: 404 }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Validation failed', statusCode: 400 }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints - signup, login, logout' },
      { name: 'Sessions', description: 'Training session management - create, update, delete sessions' },
      { name: 'Enrolments', description: 'Session enrolment operations - enroll, cancel, track attendance' },
      { name: 'Certificates', description: 'Certificate management - issue and verify certificates' },
      { name: 'Users', description: 'User management - profile, roles, permissions' }
    ],
    security: [
      { bearerAuth: [] },
      { cookieAuth: [] }
    ]
  },
  // all route and controller files
  apis: [
    './modules/auth/*.js',
    './modules/auth/*Controller.js',
    './modules/sessions/*.js',
    './modules/sessions/*Controller.js',
    './modules/enrolments/*.js',
    './modules/enrolments/*Controller.js',
    './modules/certificates/*.js',
    './modules/certificates/*Controller.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  //Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Training Management System API',
    swaggerOptions: {
      persistAuthorization: true, //  JWT  persistense
      docExpansion: 'list', 
      filter: true, //  search/filter
      showRequestDuration: true 
    }
  }));
  
  // JSON spec
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // YAML spec
  app.get('/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(require('js-yaml').dump(swaggerSpec));
  });
  
  logger.info(' Swagger UI available at /api-docs');
  logger.info(' Swagger JSON available at /swagger.json');
};

module.exports = setupSwagger;