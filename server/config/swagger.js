const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const logger = require('../utils/logger');


const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

const setupSwagger = (app) => {
  // Swagger UI 
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AICN Training API - v2.0',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion:  'none',
      filter: true,
      showRequestDuration: true,
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    }
  }));
  
//testing endpoint
   app.get('/api-docs/auth-info', (req, res) => {
    res.json({
      message: 'To authenticate, get token from POST /auth/login and click "Authorize" button',
      exampleLogin: {
        email: 'admin@example.com',
        password: 'your-password'
      }
    });
  });

  // raw YAML spec
  app.get('/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.sendFile(path.join(__dirname, '../docs/swagger.yaml'));
  });
  
  //  JSON spec 
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
  });
  
  // Swagger UI  root redirect
  app.get('/docs', (req, res) => {
    res.redirect('/api-docs');
  });
  
  logger.info(' Swagger UI available at /api-docs');
  logger.info(' Swagger YAML available at /swagger.yaml');
  logger.info(' Swagger JSON available at /swagger.json');
};

module.exports = setupSwagger;