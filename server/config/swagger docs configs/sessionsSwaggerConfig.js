const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Training Sessions API',
      version: '1.0.0',
      description: 'API documentation for the Training Sessions End Points',
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
        url: 'http://localhost:3000/api-docs',
        description: 'Development server'
      },
      {
        url: `${process.env.PRODUCTION_URL}/api-docs`,
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Session: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxyz123456' },
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
            trainerId: { type: 'string', example: 'user123456' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['title', 'skillArea', 'date', 'durationMins', 'locationType', 'capacity']
        },
        CreateSessionInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Advanced JavaScript Workshop' },
            skillArea: { type: 'string', example: 'Programming' },
            description: { type: 'string', example: 'Deep dive into modern JavaScript features' },
            date: { type: 'string', format: 'date-time', example: '2024-12-15T10:00:00Z' },
            durationMins: { type: 'integer', example: 120 },
            locationType: { type: 'string', enum: ['PHYSICAL', 'ONLINE'], example: 'ONLINE' },
            venue: { type: 'string', example: 'https://zoom.us/join/123456' },
            county: { type: 'string', example: 'Nairobi' },
            capacity: { type: 'integer', example: 30 },
            trainerId: { type: 'string', example: 'user123456' }
          },
          required: ['title', 'skillArea', 'date', 'durationMins', 'locationType', 'capacity']
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
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            statusCode: { type: 'integer', example: 400 }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'User does not have required permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./modules/sessions/*.js', './modules/sessions/sessionsController.js'] // Path to your API routes
}

const swaggerSpec = swaggerJsdoc(options)

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

module.exports = setupSwagger