const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

/**
 * Generate HTML content for certificate with all data injected
 * @param {Object} data - Certificate data
 * @returns {Promise<string>} Complete HTML string
 */

// data object---- {
// verifyUrl,
// userName,
// sessionTitle,
//  skillArea ,
//     duration ,
//    completionDate ,
//    issueDate,
//  trainerName 

// }
async function generateCertificateHTML(data) {
    // Read CSS file
    const cssPath = path.join(__dirname, 'certificate.css');
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Read HTML template
    const htmlPath = path.join(__dirname, 'certificate.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(data.verifyUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 200,
        color: {
            dark: '#1a1a2e',
            light: '#ffffff'
        }
    });
    
    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Prepare data for template
    const templateData = {
        userName: data.userName,
        sessionTitle: data.sessionTitle,
        skillArea: data.skillArea || 'Professional Development',
        duration: data.duration || '120',
        completionDate: formatDate(data.completionDate || data.issueDate),
        trainerName: data.trainerName || 'AICN Training Faculty',
        certCode: data.certCode,
        verifyUrl: data.verifyUrl,
        qrCodeDataUrl: qrCodeDataUrl
    };
    
    // Replace placeholders in HTML
    let finalHtml = htmlContent;
    for (const [key, value] of Object.entries(templateData)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalHtml = finalHtml.replace(regex, value);
    }
    
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
    getCertificateCSS,
    getCertificateHTMLTemplate
};