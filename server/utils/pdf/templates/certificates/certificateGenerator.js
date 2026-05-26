const fs = require('fs');
const path = require('path');
const generateQRCode = require('../../../qrCodes/qrService');


/**
 * Generate HTML content for certificate with all data injected
 * @param {Object} data - Certificate data
 * @returns {Promise<string>} Complete HTML string
 * 
 * Expected data object structure:
 * {
 *   verifyUrl: string,
 *   userName: string,
 *   sessionTitle: string,
 *   skillArea: string,
 *   duration: string | number,
 *   completionDate: Date | string,
 *   issueDate: Date | string,
 *   trainerName: string,
 *   certCode: string
 * }
 */
async function generateCertificateHTML(data) {
    // Read CSS file
    const cssPath = path.join(__dirname, 'certificate.css');
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Read HTML template
    const htmlPath = path.join(__dirname, 'certificate.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(data.verifyUrl);
    
    // Format date
    const formatDate = (date) => {
        if (!date) return 'Not specified';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Extract year from completion date for panel display
    const getYear = (date) => {
        if (!date) return new Date().getFullYear().toString();
        return new Date(date).getFullYear().toString();
    };
    
    // Prepare data for template - ALL placeholders must be included
    const templateData = {
        // Core certificate info
        userName: data.userName || 'Certificate Holder',
        sessionTitle: data.sessionTitle || 'Professional Development Course',
        
        // Meta info
        skillArea: data.skillArea || 'Professional Development',
        duration: data.duration?.toString() || '120',
        
        // Dates
        completionDate: formatDate(data.completionDate || data.issueDate),
        completionYear: getYear(data.completionDate || data.issueDate),
        
        // Authority signatures
        trainerName: data.trainerName || 'AICN Training Faculty',
        
        // Verification
        certCode: data.certCode || 'AICN-' + Date.now(),
        verifyUrl: data.verifyUrl || 'https://aicn.africa/verify',
        
        // QR code
        qrCodeDataUrl: qrCodeDataUrl,
        
        // Optional: trainer signature (if you available)
        trainerSigDataUrl: data.trainerSigDataUrl || ''
    };
    
    // Replace all placeholders in HTML
    let finalHtml = htmlContent;
    for (const [key, value] of Object.entries(templateData)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalHtml = finalHtml.replace(regex, value || '');
    }
    
    // Remove any remaining handlebars-style conditionals (if any)
    finalHtml = finalHtml.replace(/\{{#if[^}]*}}/g, '');
    finalHtml = finalHtml.replace(/\{\{\/if\}\}/g, '');
    
    // Inject CSS into HTML
    finalHtml = finalHtml.replace('</head>', `<style>${cssContent}</style></head>`);
    
    return finalHtml;
}

/**
 * Get just the CSS content for testing
 */
function getCertificateCSS() {
    const cssPath = path.join(__dirname, 'certificate.css');
    return fs.readFileSync(cssPath, 'utf8');
}

/**
 * Get just the HTML template for testing
 */
function getCertificateHTMLTemplate() {
    const htmlPath = path.join(__dirname, 'certificate.html');
    return fs.readFileSync(htmlPath, 'utf8');
}

module.exports = {
    generateCertificateHTML,

    // if needed
    getCertificateCSS,
    getCertificateHTMLTemplate
};