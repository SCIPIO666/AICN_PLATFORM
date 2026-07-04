const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// ─── Spec definition ────────────────────────────────────────────────────────
// swagger-jsdoc builds the OpenAPI document by scanning your route files for
// @openapi / @swagger JSDoc blocks. No external YAML file required.

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AICN Training Platform API',
      version: '2.1.0',
      description: 'Africa ICT & CS Network — Training Platform REST API',
      contact: { email: 'eaphoney@gmail.com' },
    },
    servers: [
      { url: '/api/v1', description: 'Current environment' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../modules/**/*.js'),
    path.join(__dirname, '../docs/*.yaml'), 
  ],
};

const swaggerDocument = swaggerJsdoc(options);



const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'AICN Training API - v2.1',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
        tryItOutEnabled: true,
        displayRequestDuration: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        syntaxHighlight: { activate: true, theme: 'agate' },
      },
    })
  );

  app.get('/api-docs/auth-info', (req, res) => {
    res.json({
      message: '🔐 Get a token from POST /auth/login then click "Authorize"',
      steps: [
        '1. Scroll to Authentication section',
        '2. Click POST /auth/login → Try it out → Execute',
        '3. Copy the token from the response',
        '4. Click the "Authorize" button (lock icon, top right)',
        '5. Paste the token and click Authorize',
        '6. All authenticated endpoints are now unlocked',
      ],
      testCredentials: {
        admin:   { email: 'calvince@africaictcsnetwork.org', password: 'Test123!@#' },
        trainer: { email: 'trainer@aicn.africa',            password: 'Test123!@#' },
        learner: { email: 'learner@aicn.africa',            password: 'Test123!@#' },
      },
    });
  });

  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
  });

  app.get('/docs', (req, res) => res.redirect('/api-docs'));
};

module.exports = setupSwagger;