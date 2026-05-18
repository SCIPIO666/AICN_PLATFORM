
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger=require('../../utils/logger')
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API Documentation',
      version: '1.0.0',
      description: 'API documentation for authentication endpoints',
      contact: {
        name: 'API Support',
        email: 'support@yourapp.com'
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
        description: 'Development server',
      },
      {
        url:  process.env.PRODUCTION_URL,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth_token',
          description: 'Authentication cookie',
        },
      },
      schemas: {
        // User schema
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            phone: {
              type: 'string',
              example: '+254712345678',
            },
            county: {
              type: 'string',
              example: 'Nairobi',
            },
            role: {
              type: 'string',
              enum: ['LEARNER', 'INSTRUCTOR', 'ADMIN'],
              example: 'LEARNER',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        
        // Signup Request
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone', 'county'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123',
            },
            phone: {
              type: 'string',
              example: '+254712345678',
            },
            county: {
              type: 'string',
              example: 'Nairobi',
            },
          },
        },
        
        // Login Request
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        
        // Login Response
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            expiresIn: {
              type: 'integer',
              example: 604800000,
            },
          },
        },
        
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message here',
            },
          },
        },
        
        // Signout Response
        SignoutResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Successfully signed out',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["../../routes/authRoutes.js"], // Path to API route files
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Auth API Documentation',
  }));
  
  // Serve JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  logger.info(' Swagger UI available at /api-docs');
}

module.exports = setupSwagger;