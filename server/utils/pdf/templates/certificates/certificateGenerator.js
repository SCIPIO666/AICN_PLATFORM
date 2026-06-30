
const fs = require('fs');
const path = require('path');
const { generateQRCode } = require('../../../qrCodes/qrService');

async function generateCertificateHTML(data) {
    const cssPath = path.join(__dirname, 'certificate.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    const htmlPath = path.join(__dirname, 'certificate.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const qrCodeDataUrl = await generateQRCode(data.verifyUrl);

    const formatDate = (date) => {
        if (!date) return 'Not specified';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDuration = (mins) => {
        if (!mins) return 'N/A';
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        if (hours === 0) return `${minutes} min`;
        if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${hours}h ${minutes}m`;
    };

    const templateData = {
        userName: data.userName || 'Certificate Holder',
        sessionTitle: data.sessionTitle || 'Professional Development Course',
        skillArea: data.skillArea || 'Professional Development',
        duration: formatDuration(data.duration),
        completionDate: formatDate(data.completionDate || data.issueDate),
        trainerName: data.trainerName || 'AICN Training Faculty',
        certCode: data.certCode || 'AICN-' + Date.now().toString(36).toUpperCase(),
        verifyUrl: data.verifyUrl || 'https://aicn.africa/verify',
        qrCodeDataUrl: qrCodeDataUrl,
    };

    let finalHtml = htmlContent;
    for (const [key, value] of Object.entries(templateData)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalHtml = finalHtml.replace(regex, value || '');
    }

    finalHtml = finalHtml.replace('</head>', `<style>${cssContent}</style></head>`);

    return finalHtml;
}

module.exports = { generateCertificateHTML };