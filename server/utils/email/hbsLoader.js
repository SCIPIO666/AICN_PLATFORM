
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');


require.extensions['.hbs'] = function(module, filename) {
  const templateContent = fs.readFileSync(filename, 'utf8');
  const compiledTemplate = handlebars.compile(templateContent);
  module.exports = compiledTemplate;
};