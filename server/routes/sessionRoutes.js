const express = require('express');
const sessionRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const sessionsController = require('../modules/sessions/sessionsController');

// public  routes - no auth
sessionRouter.get('/', sessionsController.getAllSessions);
sessionRouter.get('/:id', sessionsController.getSession);

// RBAC admin
sessionRouter.post('/', verifyToken, requireRole(['ADMIN']), sessionsController.createSession);
sessionRouter.put('/:id', verifyToken, requireRole(['ADMIN']), sessionsController.updateSession);
sessionRouter.delete('/:id', verifyToken, requireRole(['ADMIN']), sessionsController.deleteSession);

module.exports = sessionRouter;