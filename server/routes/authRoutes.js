const {Router}=express
const authRouter=Router()
const {verifyToken, requireRole }=require('../middleware/authMiddleware')
const authController = require('../modules/auth/authController')


// Public routes
authRouter.post('/login', authController.login)
authRouter.post('/signup', authController.signup)

// Protected routes 
authRouter.post('/signout', verifyToken, authController.signout)
authRouter.get('/me', verifyToken, authController.me)

module.exports = authRouter