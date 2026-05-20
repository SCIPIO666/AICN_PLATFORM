const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const logger = require('../utils/logger');

// Swagger docs match  Zod validation rules

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
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'John Doe' },
            email: { type: 'string', format: 'email', minLength: 5, maxLength: 255, example: 'john@example.com' },
            phone: { type: 'string', pattern: '^\\+?254[0-9]{9}$|^0[0-9]{9}$', example: '+254712345678' },
            county: { type: 'string', minLength: 2, maxLength: 50, example: 'Nairobi' },
            role: { type: 'string', enum: ['LEARNER', 'TRAINER', 'ADMIN'], example: 'LEARNER' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // ==================== AUTH SCHEMAS ====================
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 100,
              pattern: '^[a-zA-Z\\s]+$',
              example: 'John Doe' 
            },
            email: { 
              type: 'string', 
              format: 'email', 
              minLength: 5, 
              maxLength: 255,
              example: 'john@example.com' 
            },
            password: { 
              type: 'string', 
              format: 'password', 
              minLength: 6, 
              maxLength: 100,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])',
              description: 'Must contain at least one uppercase, one lowercase, one number, and one special character',
              example: 'Password123!' 
            },
            phone: { 
              type: 'string', 
              pattern: '^\\+?254[0-9]{9}$|^0[0-9]{9}$',
              example: '+254712345678' 
            },
            county: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 50,
              example: 'Nairobi' 
            },
            role: { 
              type: 'string', 
              enum: ['LEARNER', 'TRAINER'], 
              default: 'LEARNER' 
            }
          }
        },
        
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', minLength: 1, example: 'password123' }
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
        
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword', 'confirmPassword'],
          properties: {
            currentPassword: { type: 'string', minLength: 1, example: 'oldPassword123!' },
            newPassword: { 
              type: 'string', 
              minLength: 6, 
              maxLength: 100,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])',
              example: 'NewPassword123!' 
            },
            confirmPassword: { type: 'string', example: 'NewPassword123!' }
          }
        },
        
        // ==================== SESSION SCHEMAS ====================
        Session: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'session_123456' },
            title: { type: 'string', minLength: 3, maxLength: 200, example: 'Advanced JavaScript Workshop' },
            skillArea: { type: 'string', minLength: 2, maxLength: 100, example: 'Programming' },
            description: { type: 'string', maxLength: 2000, example: 'Deep dive into modern JavaScript features' },
            date: { type: 'string', format: 'date-time', example: '2024-12-15T10:00:00Z' },
            durationMins: { type: 'integer', minimum: 30, maximum: 480, example: 120 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'], example: 'ONLINE' },
            venue: { type: 'string', minLength: 3, maxLength: 500, example: 'https://zoom.us/join/123456' },
            county: { type: 'string', minLength: 2, maxLength: 50, example: 'Nairobi' },
            capacity: { type: 'integer', minimum: 1, maximum: 100, example: 30 },
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
            title: { type: 'string', minLength: 3, maxLength: 200, example: 'Advanced JavaScript Workshop' },
            skillArea: { type: 'string', minLength: 2, maxLength: 100, example: 'Programming' },
            description: { type: 'string', maxLength: 2000, example: 'Deep dive into modern JavaScript features' },
            date: { type: 'string', format: 'date-time', example: '2024-12-15T10:00:00Z' },
            durationMins: { type: 'integer', minimum: 30, maximum: 480, default: 120, example: 120 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'], default: 'PHYSICAL', example: 'ONLINE' },
            venue: { type: 'string', minLength: 3, maxLength: 500, example: 'https://zoom.us/join/123456' },
            county: { type: 'string', minLength: 2, maxLength: 50, example: 'Nairobi' },
            capacity: { type: 'integer', minimum: 1, maximum: 100, default: 30, example: 30 },
            trainerId: { type: 'string', example: 'user_123456' }
          }
        },
        
        UpdateSessionInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 200, example: 'Advanced JavaScript Workshop - Updated' },
            skillArea: { type: 'string', minLength: 2, maxLength: 100, example: 'Programming' },
            description: { type: 'string', maxLength: 2000, example: 'Updated description' },
            date: { type: 'string', format: 'date-time', example: '2024-12-16T10:00:00Z' },
            durationMins: { type: 'integer', minimum: 30, maximum: 480, example: 150 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'] },
            venue: { type: 'string', minLength: 3, maxLength: 500, example: 'Nairobi Training Center' },
            county: { type: 'string', minLength: 2, maxLength: 50, example: 'Nairobi' },
            capacity: { type: 'integer', minimum: 1, maximum: 100, example: 35 },
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
            sessionId: { type: 'string', format: 'cuid', example: 'session_123456' }
          }
        },
        
        UpdateEnrolmentInput: {
          type: 'object',
          properties: {
            status: { 
              type: 'string', 
              enum: ['ATTENDED', 'ABSENT', 'CANCELLED'], 
              description: 'Cannot update to ENROLLED status directly',
              example: 'ATTENDED' 
            }
          }
        },
        
        BulkEnrolmentInput: {
          type: 'object',
          required: ['sessionId', 'userIds'],
          properties: {
            sessionId: { type: 'string', format: 'cuid', example: 'session_123456' },
            userIds: { 
              type: 'array', 
              minItems: 1, 
              maxItems: 100,
              items: { type: 'string', format: 'cuid' },
              example: ['user_1', 'user_2', 'user_3']
            }
          }
        },
        
        // ==================== CERTIFICATE SCHEMAS ====================
        Certificate: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cert_123456' },
            userId: { type: 'string', example: 'user_123456' },
            sessionId: { type: 'string', example: 'session_123456' },
            certCode: { type: 'string', pattern: '^CERT-[A-F0-9]{16}$', example: 'CERT-ABC123XYZ' },
            issuedAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
            session: { $ref: '#/components/schemas/Session' }
          }
        },
        
        IssueCertificateInput: {
          type: 'object',
          required: ['userId', 'sessionId'],
          properties: {
            userId: { type: 'string', format: 'cuid', example: 'user_123456' },
            sessionId: { type: 'string', format: 'cuid', example: 'session_123456' }
          }
        },
        
        VerifyCertificateInput: {
          type: 'object',
          required: ['certCode'],
          properties: {
            certCode: { type: 'string', pattern: '^CERT-[A-F0-9]{16}$', example: 'CERT-ABC123XYZ' }
          }
        },
        
        // ==================== TRAINER PROFILE SCHEMAS ====================
        TrainerProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'trainer_123456' },
            userId: { type: 'string', example: 'user_123456' },
            bio: { type: 'string', maxLength: 1000, example: 'Experienced software developer...' },
            skills: { 
              type: 'array', 
              minItems: 1,
              items: { type: 'string' },
              example: ['JavaScript', 'React', 'Node.js'] 
            },
            availability: { type: 'string', maxLength: 200, example: 'Weekends and evenings' },
            motivation: { type: 'string', maxLength: 1000, example: 'Passionate about teaching...' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        CreateTrainerProfileInput: {
          type: 'object',
          required: ['skills'],
          properties: {
            bio: { type: 'string', maxLength: 1000, example: 'Experienced software developer...' },
            skills: { 
              type: 'array', 
              minItems: 1,
              maxItems: 20,
              items: { type: 'string' },
              example: ['JavaScript', 'React', 'Node.js'] 
            },
            availability: { type: 'string', maxLength: 200, example: 'Weekends and evenings' },
            motivation: { type: 'string', maxLength: 1000, example: 'Passionate about teaching...' }
          }
        },
        
        // ==================== ANNOUNCEMENT SCHEMAS ====================
        Announcement: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'announcement_123456' },
            title: { type: 'string', minLength: 3, maxLength: 200, example: 'System Maintenance' },
            body: { type: 'string', minLength: 10, maxLength: 5000, example: 'The system will be down...' },
            audience: { type: 'string', enum: ['all', 'learners', 'trainers'], example: 'all' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        
        CreateAnnouncementInput: {
          type: 'object',
          required: ['title', 'body'],
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 200, example: 'System Maintenance' },
            body: { type: 'string', minLength: 10, maxLength: 5000, example: 'The system will be down...' },
            audience: { type: 'string', enum: ['all', 'learners', 'trainers'], default: 'all' }
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
            statusCode: { type: 'integer', example: 400 },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            statusCode: { type: 'integer', example: 400 },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
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
                totalPages: { type: 'integer', example: 10 }
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
          description: 'Validation error - See errors array for details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              example: { 
                success: false, 
                message: 'Validation failed', 
                statusCode: 400,
                errors: [
                  { field: 'email', message: 'Invalid email format' },
                  { field: 'password', message: 'Password must be at least 6 characters' }
                ]
              }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints - signup, login, logout, password management' },
      { name: 'Sessions', description: 'Training session management - create, update, delete, filter sessions' },
      { name: 'Enrolments', description: 'Session enrolment operations - enroll, cancel, track attendance, bulk operations' },
      { name: 'Certificates', description: 'Certificate management - issue, verify, download certificates' },
      { name: 'Trainers', description: 'Trainer profile management - apply, approve, manage trainers' },
      { name: 'Announcements', description: 'System announcements - create, manage, broadcast messages' },
      { name: 'Users', description: 'User management - profile, roles, permissions' }
    ],
    security: [
      { bearerAuth: [] },
      { cookieAuth: [] }
    ]
  },
  // route and controller files
  apis: [
    '../modules/**/*Controller.js',  // All controllers'
    '../routes/**/*Routes.js',//All routes


  //  Auth module 
    '../modules/auth/authController.js',
    '../routes/authRoutes.js',
    
    
    // Sessions module
    './modules/sessions/sessionsController.js',
    './modules/sessions/sessionsRouter.js',
    
    // Enrollments module
    './modules/enrollments/enrolmentController.js',
    './modules/enrollments/enrolmentRouter.js',
    
    // Certificates module
    './modules/certificates/certificateController.js',
    './modules/certificates/certificateRouter.js',
    
    // Trainers module (if exists)
    './modules/trainers/trainerController.js',
    './modules/trainers/trainerRouter.js',
    
    // Announcements module (if exists)
    './modules/announcements/announcementController.js',
    './modules/announcements/announcementRouter.js',



    
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Swagger UI 
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Training Management System API',
    swaggerOptions: {
      persistAuthorization: true, //  JWT token after refresh
      docExpansion: 'list',  
      filter: true, // search/filter
      showRequestDuration: true, 
      defaultModelsExpandDepth: 3, 
      defaultModelExpandDepth: 3,
      tryItOutEnabled: true, 
      displayRequestDuration: true
    }
  }));
  
  // JSON spec endpoint
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // YAML spec endpoint
  app.get('/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    try {
      const yaml = require('js-yaml');
      res.send(yaml.dump(swaggerSpec));
    } catch (err) {
      logger.error('Failed to generate YAML spec:', err);
      res.status(500).json({ error: 'Failed to generate YAML spec' });
    }
  });
  
  // for frontend to sync
  app.get('/api/validation-rules', (req, res) => {
    //  dynamically export  Zod schemas as JSON
    res.json({
      message: 'Validation rules available in shared package',
      documentation: '/api-docs'
    });
  });
  
  logger.info(' Swagger UI available at /api-docs');
  logger.info(' Swagger JSON available at /swagger.json');
  logger.info('Swagger YAML available at /swagger.yaml');
};

module.exports = setupSwagger;