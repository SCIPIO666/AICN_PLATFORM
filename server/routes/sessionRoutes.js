const express = require('express')
const sessionRouter = express.Router()
const { verifyToken, requireRole } = require('../middleware/authMiddleware')
const sessionsController = require('../modules/sessions/sessionsController')

// RBAC
sessionRouter.get('/', 
  verifyToken, 
  sessionsController.getAllSessions
)

sessionRouter.get('/:id', 
  verifyToken, 
  sessionsController.getSession
)

sessionRouter.post('/', 
  verifyToken, 
  requireRole(['ADMIN', 'TRAINER']), 
  sessionsController.createSession
)

sessionRouter.put('/:id', 
  verifyToken, 
  requireRole(['ADMIN', 'TRAINER']), 
  sessionsController.updateSession
)

sessionRouter.delete('/:id', 
  verifyToken, 
  requireRole(['ADMIN']), 
  sessionsController.deleteSession
)

module.exports = sessionRouter