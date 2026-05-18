
 // Visit: http://localhost:PORT/api/v1/docs
 

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi    = require('swagger-ui-express')

// ─── Base Config ─────────────────────────────────────────────────────────────

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
                url:         'http://localhost:3000',
                description: 'Local development',
            },
            {
                url:         'https://your-production-url.com',
                description: 'Production',
            },
        ],
        components: {

            // ── Reusable Schemas ─────────────────────────────────────────────
            schemas: {

                // What a safe user object looks like (no password)
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

                // Generic error shape
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

            // ── Security Schemes ─────────────────────────────────────────────
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

        // Default security for ALL routes — can be overridden per-endpoint
        security: [{ BearerAuth: [] }],
    },

    // Where swagger-jsdoc scans for @swagger JSDoc comments
    apis: ['./src/modules/auth/authRouter.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = { swaggerUi, swaggerSpec }


// ═════════════════════════════════════════════════════════════════════════════
//  JSDoc annotations — paste these into authRouter.js
//  swagger-jsdoc will pick them up automatically from the `apis` path above.
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication — signup, login, signout, current user
 */

// ─── POST /api/auth/signup ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []          # public — no token needed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           examples:
 *             minimal:
 *               summary: Required fields only
 *               value:
 *                 name: "Dev Scipio"
 *                 email: "dev@example.com"
 *                 password: "StrongPass123!"
 *             full:
 *               summary: All fields
 *               value:
 *                 name: "Dev Scipio"
 *                 email: "dev@example.com"
 *                 password: "StrongPass123!"
 *                 phone: "0712345678"
 *                 county: "Nairobi"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Name, email, and password are required"
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "User with email dev@example.com already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ─── POST /api/auth/login ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []          # public — no token needed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "dev@example.com"
 *             password: "StrongPass123!"
 *     responses:
 *       200:
 *         description: Login successful — JWT returned in body and set as HttpOnly cookie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: auth_token=eyJ...; HttpOnly; SameSite=Lax; Path=/
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT — valid for 7 days
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn:
 *                   type: integer
 *                   description: Milliseconds until expiry (7 days)
 *                   example: 604800000
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Email and password required"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ─── POST /api/auth/signout ──────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out and invalidate the current token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     description: >
 *       Blacklists the provided JWT so it cannot be reused.
 *       The auth_token cookie is also cleared.
 *       Send the token in the Authorization header as `Bearer <token>`,
 *       OR rely on the cookie set at login.
 *     responses:
 *       200:
 *         description: Successfully signed out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully signed out"
 *       400:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "No token provided"
 *       401:
 *         description: Invalid, expired, or already-revoked token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Token has been revoked. Please login again."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     description: >
 *       Returns the full profile of the user who owns the provided JWT.
 *       Password is never included in the response.
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing, invalid, expired, or blacklisted token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: No token sent
 *                 value:
 *                   error: "No token provided"
 *               revoked:
 *                 summary: Token was signed out
 *                 value:
 *                   error: "Token has been revoked. Please login again."
 *       404:
 *         description: User no longer exists in DB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
