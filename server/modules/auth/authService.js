const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const prisma=require('../../config/db')
const logger=require('../../utils/logger')
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
    
        await cleanupExpiredTokens() //cleanup expired
        
        return { 
            success: true, 
            message: 'Successfully signed out' 
        }
        
    } catch (error) {
        logger.error(error.message)
        throw error
    }
}

async function signup(name, email, password, phone, county ){
    try {
    const existingUser=await findUser(email)
        if(existingUser)  throw new Error(`User with email ${email} already exists`)
        const hashed = await bcrypt.hash(password, 12)     
    const newUser=await createUser(name, email, password, phone, county)
    return newUser    
    } catch (error) {
         if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            throw new Error(`User with email ${email} already exists`)
        }
        throw error
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
