// config/swagger.js
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const logger = require('../utils/logger');

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

const setupSwagger = (app) => {
  // Swagger UI with enhanced configuration
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AICN Training API - v2.1',
    swaggerOptions: {
      persistAuthorization: true,      // 🔑 Keeps token across page refreshes
      docExpansion: 'list',            // 📋 Expand all tags by default
      filter: true,                    // 🔍 Enable filtering
      showRequestDuration: true,       // ⏱️ Show request duration
      defaultModelsExpandDepth: 3,     // 📚 Expand models
      defaultModelExpandDepth: 3,      // 📚 Expand model details
      tryItOutEnabled: true,           // 🎯 Auto-enable "Try it out"
      displayRequestDuration: true,    // ⏱️ Display request duration
      tagsSorter: 'alpha',             // 🔤 Sort tags alphabetically
      operationsSorter: 'alpha',       // 🔤 Sort operations alphabetically
      syntaxHighlight: {
        activate: true,
        theme: 'agate'                 // 🎨 Better code highlighting
      },
      authorization: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    }
      
    }
  }));
  
  // Helper endpoint to get authentication info
  app.get('/api-docs/auth-info', (req, res) => {
    res.json({
      message: '🔐 To authenticate, get token from POST /auth/login and click "Authorize" button',
      steps: [
        '1. Scroll to Authentication section',
        '2. Click POST /auth/login',
        '3. Click "Try it out"',
        '4. Enter credentials and click "Execute"',
        '5. Copy the token from response',
        '6. Click "Authorize" button (top right, lock icon)',
        '7. Paste token (without quotes) and click "Authorize"',
        '8. Now test any endpoint!'
      ],
      testCredentials: {
        admin: {
          email: 'admin@aicn.africa',
          password: 'Test123!@#',
          note: 'Full system access'
        },
        trainer: {
          email: 'trainer@aicn.africa', 
          password: 'Test123!@#',
          note: 'Can mark attendance, view assigned sessions'
        },
        learner: {
          email: 'learner@aicn.africa',
          password: 'Test123!@#',
          note: 'Can browse, enroll, get certificates'
        }
      },
      endpointsByRole: {
        admin: [
          'GET /admin/stats',
          'GET /admin/users',
          'PATCH /admin/users/{userId}/role',
          'POST /admin/announcements',
          'POST /sessions',
          'POST /certificates/batch/{sessionId}',
          'PATCH /trainers/admin/applications/{id}/approve'
        ],
        trainer: [
          'GET /trainers/me',
          'GET /trainers/me/sessions',
          'PATCH /enrolments/{id}/attend'
        ],
        learner: [
          'GET /sessions',
          'POST /enrolments',
          'GET /enrolments/me',
          'GET /certificates/me',
          'POST /trainers/apply'
        ]
      }
    });
  });

  // Raw YAML spec for Postman/Insomnia import
  app.get('/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.setHeader('Content-Disposition', 'inline; filename="aicn-api-spec.yaml"');
    res.sendFile(path.join(__dirname, '../docs/swagger.yaml'));
  });
  
  // JSON spec for programmatic access
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
  });

  // Alt URL for docs
  app.get('/docs', (req, res) => {
    res.redirect('/api-docs');
  });
  
  // Health check for swagger
  app.get('/api-docs/health', (req, res) => {
    res.json({
      status: 'OK',
      swaggerUi: true,
      specVersion: swaggerDocument.info?.version,
      endpoints: {
        ui: '/api-docs',
        yaml: '/swagger.yaml',
        json: '/swagger.json',
        docs: '/docs'
      }
    });
  });
  
};

module.exports = setupSwagger;
