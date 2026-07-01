const fs = require('fs');
const Handlebars = require('handlebars');

require.extensions['.hbs'] = function (module, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  module.exports = Handlebars.compile(src);
};