const express = require('express');
const adminRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const adminController = require('../modules/admin/adminController');
const  validate  = require('../middleware/validate');

//  validation schemas
const { 
  createAnnouncementSchema, 
  updateAnnouncementSchema,
  announcementFiltersSchema  ,
} = require('../../shared/validators/announcementValidation');

const { 
  userFiltersSchema, 
  updateUserRoleSchema,
  idParamSchema 
} = require('../../shared/validators/adminValidation');

const {userIdParamSchema}=require('../../shared/validators/commonValidation')

// to all admin routes
adminRouter.use(verifyToken);
adminRouter.use(requireRole('ADMIN'));

// ============ STATS ============
// No validation needed (only user from token)
adminRouter.get('/stats',adminController.getStats);

// ============ USER MANAGEMENT ============
// GET /users - with query validation
adminRouter.get(
  '/users', 
  validate(userFiltersSchema, 'query'),  
  adminController.getAllUsers
);

// PATCH /users/:userId/role - with param + body validation
adminRouter.patch(
  '/users/:userId/role',
  validate(userIdParamSchema, 'params'),           
  validate(updateUserRoleSchema, 'body'),      
  adminController.updateUserRoleController     
);

// ============ ANNOUNCEMENT MANAGEMENT ============
// POST /announcements - create
adminRouter.post(
  '/announcements', 
  validate(createAnnouncementSchema, 'body'),
  adminController.createAnnouncement
);

// GET /announcements - with query validation
adminRouter.get(
  '/announcements',
  validate(announcementFiltersSchema, 'query'),  adminController.getAllAnnouncements
);

// PUT /announcements/:id - update
adminRouter.put(
  '/announcements/:id',
  validate(require('../../shared/validators/announcementValidation').idParamSchema, 'params'),           
  validate(updateAnnouncementSchema, 'body'),
  adminController.updateAnnouncement
);

// DELETE /announcements/:id
adminRouter.delete(
  '/announcements/:id',
  validate(require('../../shared/validators/announcementValidation').idParamSchema, 'params'),          
  adminController.deleteAnnouncement
);

module.exports = adminRouter;