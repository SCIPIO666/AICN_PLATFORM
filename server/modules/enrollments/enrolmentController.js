const enrolmentsService = require('./enrolmentService');
const logger = require('../../utils/logger');

/**
 * @swagger
 * /enrolments:
 *   get:
 *     summary: Get all enrolments
 *     tags: [Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Filter by session ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ENROLLED, ATTENDED, ABSENT, CANCELLED]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Enrolments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
const getAllEnrolments = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    delete filters.page;
    delete filters.limit;
    
    // Non-admin users can only see their own enrolments
    if (req.user.role !== 'ADMIN') {
      filters.userId = req.user.id;
    }
    
    const result = await enrolmentsService.getAllEnrolments(
      filters,
      req.query.page,
      req.query.limit
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    logger.error(`Failed to fetch enrolments: ${err.message}`);
    next(err);
  }
};

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
const getEnrolment = async (req, res, next) => {
  try {
    const enrolment = await enrolmentsService.getEnrolment(req.params.id);
    
    // Check permission
    if (req.user.role !== 'ADMIN' && enrolment.userId !== req.user.id) {
      throw new Error('Access denied');
    }
    
    res.status(200).json({
      success: true,
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to fetch enrolment: ${err.message}`);
    next(err);
  }
};

/**
 * @swagger
 * /enrolments:
 *   post:
 *     summary: Enroll in a session
 *     tags: [Enrolments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEnrolmentInput'
 *     responses:
 *       201:
 *         description: Successfully enrolled
 */
const createEnrolment = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const enrolment = await enrolmentsService.createEnrolment(req.user.id, sessionId);
    res.status(201).json({
      success: true,
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to create enrolment: ${err.message}`);
    next(err);
  }
};

/**
 * @swagger
 * /enrolments/{id}:
 *   put:
 *     summary: Update enrolment status
 *     tags: [Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEnrolmentInput'
 *     responses:
 *       200:
 *         description: Enrolment updated successfully
 */
const updateEnrolment = async (req, res, next) => {
  try {
    const enrolment = await enrolmentsService.updateEnrolment(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );
    res.status(200).json({
      success: true,
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to update enrolment: ${err.message}`);
    next(err);
  }
};

/**
 * @swagger
 * /enrolments/{id}:
 *   delete:
 *     summary: Cancel enrolment
 *     tags: [Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Enrolment cancelled successfully
 */
const deleteEnrolment = async (req, res, next) => {
  try {
    await enrolmentsService.deleteEnrolment(req.params.id, req.user.id, req.user.role);
    res.status(200).json({
      success: true,
      message: 'Enrolment cancelled successfully'
    });
  } catch (err) {
    logger.error(`Failed to delete enrolment: ${err.message}`);
    next(err);
  }
};

module.exports = {
  getAllEnrolments,
  getEnrolment,
  createEnrolment,
  updateEnrolment,
  deleteEnrolment
};