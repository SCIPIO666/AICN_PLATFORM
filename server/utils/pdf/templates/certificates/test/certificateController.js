const { generateCertificatePDF } = require('../certificateGenerator');
const { getTestScenarios } = require('./testData');
const logger = require('../../../../logger');

/**
 * Test endpoint - Generate a single certificate preview
 * GET /api/v1/certificates/test/preview
 */
const previewCertificate = async (req, res) => {
  try {
    const scenario = req.query.scenario || 'premium';
    const scenarios = getTestScenarios();
    const data = scenarios[scenario] || scenarios.premium;
    
    logger.info(`Generating test certificate preview for scenario: ${scenario}`);
    
    const pdfBuffer = await generateCertificatePDF(data);
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `inline; filename="certificate-${scenario}.pdf"`,
      'Cache-Control': 'no-cache'
    });
    res.end(pdfBuffer);
    
  } catch (error) {
    logger.error(`Certificate preview failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate preview',
      error: error.message
    });
  }
};

/**
 * Test endpoint - Download certificate as attachment
 * GET /api/v1/certificates/test/download
 */
const downloadTestCertificate = async (req, res) => {
  try {
    const scenario = req.query.scenario || 'premium';
    const scenarios = getTestScenarios();
    const data = scenarios[scenario] || scenarios.premium;
    
    logger.info(`Generating test certificate download for scenario: ${scenario}`);
    
    const pdfBuffer = await generateCertificatePDF(data);
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="AICN_Certificate_${data.certCode}.pdf"`,
      'Cache-Control': 'no-cache'
    });
    res.end(pdfBuffer);
    
  } catch (error) {
    logger.error(`Certificate download failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate download',
      error: error.message
    });
  }
};

/**
 * Test endpoint - Generate multiple certificates (batch test)
 * GET /api/v1/certificates/test/batch
 */
const batchTestCertificates = async (req, res) => {
  try {
    const scenarios = getTestScenarios();
    const results = [];
    
    for (const [key, data] of Object.entries(scenarios)) {
      try {
        const pdfBuffer = await generateCertificatePDF(data);
        results.push({
          scenario: key,
          success: true,
          size: pdfBuffer.length,
          certCode: data.certCode
        });
      } catch (error) {
        results.push({
          scenario: key,
          success: false,
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Generated ${results.filter(r => r.success).length}/${results.length} certificates`,
      data: results
    });
    
  } catch (error) {
    logger.error(`Batch test failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Batch test failed',
      error: error.message
    });
  }
};

/**
 * Test endpoint - Get certificate HTML preview (for debugging)
 * GET /api/v1/certificates/test/html
 */
const previewHTML = async (req, res) => {
  try {
    const { generateCertificateHTML } = require('../../utils/pdf/templates/certificate/certificateGenerator');
    const scenarios = getTestScenarios();
    const data = scenarios[req.query.scenario || 'premium'];
    
    const html = await generateCertificateHTML(data);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    logger.error(`HTML preview failed: ${error.message}`);
    res.status(500).send(error.message);
  }
};

/**
 * Test endpoint - Get CSS styles (for debugging)
 * GET /api/v1/certificates/test/css
 */
const previewCSS = async (req, res) => {
  try {
    const { getCertificateCSS } = require('../../utils/pdf/templates/certificate/certificateGenerator');
    const css = getCertificateCSS();
    
    res.setHeader('Content-Type', 'text/css');
    res.send(css);
    
  } catch (error) {
    logger.error(`CSS preview failed: ${error.message}`);
    res.status(500).send(error.message);
  }
};

module.exports = {
  previewCertificate,
  downloadTestCertificate,
  batchTestCertificates,
  previewHTML,
  previewCSS
};