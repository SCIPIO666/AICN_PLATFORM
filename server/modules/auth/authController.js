const logger = require('../../utils/logger')
const authService = require('./authService')




/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user and returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' })
        }

        const result = await authService.login(email, password)
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: result.expiresIn
        })

        return res.status(200).json({
            success: true,
            user: result.user,
            token: result.token,
            expiresIn: result.expiresIn
        })
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ success: false, error: 'Invalid email or password' })
        }
        return res.status(500).json({ success: false, error: 'Login failed. Please try again later.' })
    }
}



/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: User created successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

async function signup(req, res) {
    try {
        const { name, email, password, phone, county } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email, and password are required' })
        }

        const newUser = await authService.signup(name, email, password, phone, county)

        return res.status(201).json({ success: true, user: newUser })
    } catch (error) {
        logger.error(error.message)

        if (error.message?.includes('already exists')) {
            return res.status(409).json({ success: false, error: error.message })
        }

        return res.status(500).json({ success: false, error: 'Signup failed. Please try again later.' })
    }
}

async function signout(req, res) {
    try {
        const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(400).json({ success: false, error: 'No token provided' })
        }

        const result = await authService.signout(token, req.userId)
        res.clearCookie('auth_token')

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        logger.error(error.message)

        if (error.message === 'Invalid token') {
            return res.status(400).json({ success: false, error: 'Invalid token' })
        }

        return res.status(500).json({ success: false, error: 'Logout failed' })
    }
}

async function me(req, res) {
    try {
        const user = await authService.me(req.userId)
        return res.status(200).json({ success: true, user })
    } catch (error) {
        logger.error(error.message)

        if (error.message === 'User not found') {
            return res.status(404).json({ success: false, error: 'User not found' })
        }

        return res.status(500).json({ success: false, error: 'Failed to fetch user' })
    }
}

module.exports = { login, signup, signout, me }