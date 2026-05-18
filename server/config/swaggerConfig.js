
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi    = require('swagger-ui-express')



const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title:       'Auth API',
            version:     '1.0.0',
            description: 'Authentication endpoints — signup, login, signout, and current user.',
        },
        servers: [
            {
                url:         `http://localhost:${process.env.PORT}`,
                description: 'Local development',
            },
            {
                url:         `${process.env.PRODUCTION_URL}`,
                description: 'Production',
            },
        ],
        components: {

            // schemas
            //reusable schemas
            schemas: {

                // safe user
                User: {
                    type: 'object',
                    properties: {
                        id:        { type: 'integer',  example: 1 },
                        name:      { type: 'string',   example: 'Dev Scipio' },
                        email:     { type: 'string',   format: 'email', example: 'dev@example.com' },
                        phone:     { type: 'string',   example: '0712345678' },
                        county:    { type: 'string',   example: 'Nairobi' },
                        role:      { type: 'string',   enum: ['LEARNER', 'ADMIN'], example: 'LEARNER' },
                        createdAt: { type: 'string',   format: 'date-time' },
                        updatedAt: { type: 'string',   format: 'date-time' },
                    },
                },

                //error shape
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error:   { type: 'string',  example: 'Descriptive error message' },
                    },
                },

                // Signup request body
                SignupRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name:     { type: 'string',  example: 'Dev Scipio' },
                        email:    { type: 'string',  format: 'email', example: 'dev@example.com' },
                        password: { type: 'string',  format: 'password', example: 'StrongPass123!' },
                        phone:    { type: 'string',  example: '0712345678' },
                        county:   { type: 'string',  example: 'Nairobi' },
                    },
                },

                // Login request body
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email:    { type: 'string', format: 'email',    example: 'dev@example.com' },
                        password: { type: 'string', format: 'password', example: 'StrongPass123!' },
                    },
                },
            },

                //security schemes
            securitySchemes: {
                BearerAuth: {
                    type:         'http',
                    scheme:       'bearer',
                    bearerFormat: 'JWT',
                    description:  'Enter your JWT token. Obtain it from POST /api/auth/login.',
                },
                CookieAuth: {
                    type: 'apiKey',
                    in:   'cookie',
                    name: 'auth_token',
                    description: 'HttpOnly cookie set automatically on login.',
                },
            },
        },

        security: [{ BearerAuth: [] }],
    },
    apis: ['../routes/authRoutes.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = { swaggerUi, swaggerSpec }