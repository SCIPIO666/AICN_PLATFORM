const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const prisma=require('../../config/db')
const logger=require('../../utils/logger')
 const { sendWelcomeEmail } = require('../../utils/email/email services/aicnEmailsService');
const {findUser,
    findUserById,
    findManyUsers,
    findAllUsers,
    updateUser,
    deleteUser,
    createUser,
    findUserWithPassword,
    updateUserPassword,
    countUsers
} = require('../users/usersModel')

async function login(email,password){
  try {
    const user=await findUserWithPassword(email)
    if (!user) throw new Error('Invalid credentials')
    const isValid = await bcrypt.compare(password, user.password)
        
        if (!isValid) {
            throw new Error('Invalid password')
        }
        const tokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role
                }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password: _, ...safeUser } = user
    return { user: safeUser,
                token,
                expiresIn: 7 * 24 * 60 * 60 * 1000
            }
  } catch (error) {
   throw new Error('Invalid email or password')
  }
}
async function signout(token, userId){
    try {
        // token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const expiresAt = new Date(decoded.exp * 1000)
        
        // db storage
        await prisma.blacklistedToken.create({
            data: {
                token,
                userId: userId || decoded.userId,
                expiresAt
            }
        })
    
        //cleanup expired
        await cleanupExpiredTokens().catch(err => logger.error('Cleanup failed:', err.message))
        
        return { 
            success: true, 
            message: 'Successfully signed out' 
        }
        
    } catch (error) {
        logger.error(error.message)
        throw error
    }
}


/**
 * Signup new user with welcome email
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed)
 * @param {string} phone - User's phone number
 * @param {string} county - User's county
 * @returns {Promise<Object>} Created user object
 */
async function signup(name, email, password, phone, county) {
    try {
        // Check for existing user
        const existingUser = await findUser(email);
        if (existingUser) {
            if (existingUser.deletedAt) {
                throw new Error('This email was previously deactivated. Please contact support.');
            }
            throw new Error(`User with email ${email} already exists`);
        }
        
        // Create new user
        const newUser = await createUser(name, email, password, phone, county);
        
        // Send welcome email (non-blocking)
        sendWelcomeEmail({
            to: newUser.email,
            name: newUser.name,
            role: newUser.role || 'USER',
            tempPassword: null, 
            frontendUrl: process.env.FRONTEND_URL
        }).catch(err => {
            logger.error(`Failed to send welcome email to ${newUser.email}:`, {
                error: err.message,
                userId: newUser.id,
                email: newUser.email
            });
        });
        
        logger.info(`New user registered: ${newUser.email} (ID: ${newUser.id})`);
        
        // Return user without password
        const { password: _, ...safeUser } = newUser;
        return safeUser;
        
    } catch (error) {
        logger.error(`Signup failed for ${email}: ${error.message}`);
        throw error;
    }
}

/**
 * Cleanup expired tokens from blacklist
 */
async function cleanupExpiredTokens() {
    try {
        const result = await prisma.blacklistedToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
        
        if (result.count > 0) {
            logger.info(`Cleaned up ${result.count} expired blacklisted tokens`);
        }
        
        return result;
    } catch (error) {
        logger.error(`Token cleanup failed: ${error.message}`);
        throw error;
    }
}

async function me (userId){
try {
      const user = await findUserById(userId)
         if(!user) throw new Error ('User not found') 
        return user

} catch (error) {
throw error
}
}

async function cleanupExpiredTokens() {
    try {
        await prisma.blacklistedToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        })
    } catch (error) {
        logger.error(error.message)
        throw error
    }
}
module.exports={login,signout,signup,me}
