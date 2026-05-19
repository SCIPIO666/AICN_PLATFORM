const sessionsService = require('./sessionsService')
const logger = require('../../utils/logger')

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all sessions with optional filters
 *     description: Retrieve a list of all sessions. Can be filtered by query parameters.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Filter by session status
 *       - in: query
 *         name: skillArea
 *         schema:
 *           type: string
 *         description: Filter by skill area
 *       - in: query
 *         name: locationType
 *         schema:
 *           type: string
 *           enum: [PHYSICAL, ONLINE]
 *         description: Filter by location type
 *       - in: query
 *         name: county
 *         schema:
 *           type: string
 *         description: Filter by county
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *         description: Filter by trainer ID
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter sessions starting from this date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter sessions up to this date
 *     responses:
 *       200:
 *         description: List of sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAllSessions = async (req, res, next) => {
  try {
    const filters = { ...req.query }
    const sessions = await sessionsService.getAllSessions(filters)
    res.status(200).json({
      success: true,
      data: sessions
    })
  } catch (err) { 
    logger.error(`Failed to fetch sessions: ${err.message}`)
    next(err) 
  }
}

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a single session by ID
 *     description: Retrieve detailed information about a specific session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *         example: clxyz123456
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
const getSession = async (req, res, next) => {
  try {
    const id = req.params.id
    const session = await sessionsService.getSession(id)
    res.status(200).json({
      success: true,
      data: session
    })
  } catch (err) { 
    logger.error(`Failed to fetch session ${id}: ${err.message}`)
    next(err)
  }
}

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     description: Create a new training session. Requires ADMIN or TRAINER role.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionInput'
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Internal server error
 */
const createSession = async (req, res, next) => {
  try {
    const sessionData = req.body
    const session = await sessionsService.createSession(sessionData)
    res.status(201).json({
      success: true,
      data: session
    })
  } catch (err) {
    logger.error(`Failed to create session: ${err.message}`)
    next(err)
  }
}

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Update an existing session
 *     description: Update session details. Requires ADMIN or TRAINER role.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSessionInput'
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
const updateSession = async (req, res, next) => {
  try {
    const id = req.params.id
    const updateData = req.body
    const session = await sessionsService.updateSession(id, updateData)
    res.status(200).json({
      success: true,
      data: session
    })
  } catch (err) { 
    logger.error(`Failed to update session ${req.params.id}: ${err.message}`)
    next(err) 
  }
}

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     description: Delete a session. Requires ADMIN role only.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Session deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
const deleteSession = async (req, res, next) => {
  try {
    const id = req.params.id
    await sessionsService.deleteSession(id)
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    })
  } catch (err) { 
    logger.error(`Failed to delete session ${req.params.id}: ${err.message}`)
    next(err) 
  }
}

module.exports = { 
  getAllSessions, 
  getSession, 
  createSession, 
  updateSession, 
  deleteSession 
}