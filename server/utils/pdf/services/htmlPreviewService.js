// For testing only
const ejs = require('ejs');
const path = require('path');

async function previewHtml(templateName, data) {
  const templatePath = path.join(__dirname, '../../views', `${templateName}.ejs`);
  return await ejs.renderFile(templatePath, data);
}

module.exports = previewHtml;