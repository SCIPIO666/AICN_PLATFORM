const logger=require('../../utils/logger')
const authService= require('./authService')

async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password required'
            })
        }
        
        const result = await authService.login(email, password)
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: result.expiresIn
        })

        res.status(200).json({
            success: true,
            user: result.user,
            token: result.token,
            expiresIn: result.expiresIn
        })
        
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            })
        }
        
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again later.'
        })
    }
}

async function signup(req, res){
    try {
        
    } catch (error) {
       logger.error(error.message) 
    }
}

async function signout(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(400).json({ error: 'No token provided' })
        }
   
        const result = await authService.signout(token, req.user?.userId)
        
        // Clear cookies
        res.clearCookie('auth_token')
        
        res.status(200).json({
            success: true,
            message: result.message
        })
        
    } catch (error) {
      logger.error(error.message)
        
        if (error.message === 'Invalid token') {
            return res.status(400).json({ error: 'Invalid token' })
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Logout failed' 
        })
    }
}
async function me(req, res){
    try {
        const me=await authService.me(req.userId)
    } catch (error) {
        logger.error(error.message)
         next(error)
    }
}

module.exports={
    login,
    signout,
    signup,
    me
}
