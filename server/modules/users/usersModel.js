const { prisma } = require('../../config/db')
const logger = require('../../utils/logger')
const bcrypt = require('bcrypt') 

async function findUser(email) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                county: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        return existingUser
    } catch (error) {
        logger.error(`failed finding user ${email} : ${error.message}`)
        throw error
    }
}

async function findUserById(id) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                county: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        return existingUser
    } catch (error) {
        logger.error(`failed finding user by id ${id} : ${error.message}`)
        throw error
    }
}

async function findManyUsers(emailArray) {
    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    in: emailArray
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                county: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        return users
    } catch (error) {
        logger.error(`failed finding multiple users: ${error.message}`)
        throw error
    }
}

async function findAllUsers(filters = {}) {
    try {
        const { role, county, page = 1, limit = 10 } = filters
        const skip = (page - 1) * limit
        
        const where = {}//filters,adding only selected search criteria
        if (role) where.role = role
        if (county) where.county = county
        
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                county: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        const total = await prisma.user.count({ where })
        
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        logger.error(`failed finding all users: ${error.message}`)
        throw error
    }
}

async function updateUser(email, detailsObject) {
    try {
        //  sensitive fields  need protection,update non sensitive fields only
        const allowedUpdates = ['name', 'phone', 'county', 'role']
        const updateData = {}
        
        for (const updateDetail of allowedUpdates) {
            if (detailsObject[updateDetail] !== undefined) {
                updateData[updateDetail] = detailsObject[updateDetail]
            }
        }
        
        // passwords updated separtely
        if (detailsObject.password) {
            const saltRounds = 12
            updateData.password = await bcrypt.hash(detailsObject.password, saltRounds)
        }
        
        const updatedUser = await prisma.user.update({
            where: { email },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                county: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        
        return updatedUser
    } catch (error) {
        logger.error(`failed updating user ${email}: ${error.message}`)
        throw error
    }
}

async function deleteUser(email) {
    try {
        //  if user exists first
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true }
        })
        
        if (!existingUser) {
            throw new Error(`User with email ${email} not found`)
        }
        
        const deletedUser = await prisma.user.delete({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })     
        return deletedUser
    } catch (error) {
        logger.error(`failed deleting user ${email}: ${error.message}`)
        throw error
    }
}

async function createUser(name, email, password, phone, county) {
    try {
        // if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        })
        
        if (existingUser) {
            throw new Error(`User with email ${email} already exists`)
        }
        
        // Hash the password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        // Create the user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                county,
                role: 'LEARNER' // default,later apply for role upgrade
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                county: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                //password norrt returned
            }
        })     
        return newUser
    } catch (error) {
        logger.error(`failed creating user ${email}: ${error.message}`)
        throw error
    }
}

async function findUserWithPassword(email) {
    try {
        // returning password for verification only
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true
            }
        })
    
        return user
    } catch (error) {
        logger.error(`failed verifying password for ${email}: ${error.message}`)
        throw error
    }
}

async function updateUserPassword(email, currentPassword, newPassword) {
    try {
        //verify
        await verifyUserPassword(email, currentPassword)
        
        // Hash 
        const saltRounds = 12
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)
        
        // Update password
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { password: hashedNewPassword },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true
            }
        })       
        return updatedUser
    } catch (error) {
        logger.error(`failed updating password for ${email}: ${error.message}`)
        throw error
    }
}

async function countUsers(filters = {}) {
    try {
        const { role, county } = filters
        const where = {}
        
        if (role) where.role = role
        if (county) where.county = county
        
        const count = await prisma.user.count({ where })
        return count
    } catch (error) {
        logger.error(`failed counting users: ${error.message}`)
        throw error
    }
}

module.exports = {
    findUser,
    findUserById,
    findManyUsers,
    findAllUsers,
    updateUser,
    deleteUser,
    createUser,
    findUserWithPassword,
    updateUserPassword,
    countUsers
}