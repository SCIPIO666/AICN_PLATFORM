const express = require('express');
const enrolmentsRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware')
const enrolmentsController = require('../modules/enrollments/enrolmentController');

// auth
enrolmentsRouter.use(verifyToken);


enrolmentsRouter.get('/', enrolmentsController.getAllEnrolments);
enrolmentsRouter.post('/', enrolmentsController.createEnrolment);

/**
 * @swagger
 * /enrolments/{id}:
 *   get:
 *     summary: Get enrolment by ID
 *     tags: [Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrolment retrieved successfully
 */
enrolmentsRouter.get('/:id', enrolmentsController.getEnrolment);
enrolmentsRouter.put('/:id', enrolmentsController.updateEnrolment);
enrolmentsRouter.delete('/:id', enrolmentsController.deleteEnrolment);

// rbac
enrolmentsRouter.get('/admin/all', 
  requireRole(['ADMIN']), 
  enrolmentsController.getAllEnrolments
);

module.exports = enrolmentsRouter;