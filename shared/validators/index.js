// Export all validation schemas
const authValidation = require('./authValidation');
const sessionValidation = require('./sessionValidation');
const enrolmentValidation = require('./enrolmentValidation');
const certificateValidation = require('./certificateValidation');
const trainerValidation = require('./trainerValidation');
const announcementValidation = require('./announcementValidation');
const commonValidation = require('./commonValidation');

// Export enums for frontend use
const enums = require('../constants/enums');

module.exports = {
  // Auth
  signupSchema: authValidation.signupSchema,
  loginSchema: authValidation.loginSchema,
  changePasswordSchema: authValidation.changePasswordSchema,
  forgotPasswordSchema: authValidation.forgotPasswordSchema,
  resetPasswordSchema: authValidation.resetPasswordSchema,
  updateProfileSchema: authValidation.updateProfileSchema,
  
  // Session
  createSessionSchema: sessionValidation.createSessionSchema,
  updateSessionSchema: sessionValidation.updateSessionSchema,
  sessionFiltersSchema: sessionValidation.sessionFiltersSchema,
  
  // Enrolment
  createEnrolmentSchema: enrolmentValidation.createEnrolmentSchema,
  updateEnrolmentSchema: enrolmentValidation.updateEnrolmentSchema,
  enrolmentFiltersSchema: enrolmentValidation.enrolmentFiltersSchema,
  bulkEnrolmentSchema: enrolmentValidation.bulkEnrolmentSchema,
  
  // Certificate
  issueCertificateSchema: certificateValidation.issueCertificateSchema,
  verifyCertificateSchema: certificateValidation.verifyCertificateSchema,
  certificateFiltersSchema: certificateValidation.certificateFiltersSchema,
  
  // Trainer
  createTrainerProfileSchema: trainerValidation.createTrainerProfileSchema,
  updateTrainerProfileSchema: trainerValidation.updateTrainerProfileSchema,
  updateTrainerStatusSchema: trainerValidation.updateTrainerStatusSchema,
  trainerFiltersSchema: trainerValidation.trainerFiltersSchema,
  
  // Announcement
  createAnnouncementSchema: announcementValidation.createAnnouncementSchema,
  updateAnnouncementSchema: announcementValidation.updateAnnouncementSchema,
  announcementFiltersSchema: announcementValidation.announcementFiltersSchema,
  
  // Common
  idSchema: commonValidation.idSchema,
  paginationSchema: commonValidation.paginationSchema,
  dateRangeSchema: commonValidation.dateRangeSchema,
  
  // Enums
  enums,
  
  // Middleware
  validate: require('../middleware/validate').validate
};