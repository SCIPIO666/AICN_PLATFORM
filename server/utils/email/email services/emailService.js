const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { transporter } = require('../../../config/email');
const logger = require('../../logger');



module.exports = {
  sendWelcomeEmail,
  sendCertificateEmail,
  sendEnrolmentConfirmation,
  sendTrainerStatusEmail,
  sendBulkCertificateEmails
};