const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
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

const KENYAN_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Nyamira','Kisii',
  'Kakamega','Narok','Migori','Homa Bay','Bomet','Siaya','Other'
]

async function login(email,password){

  return { user: safeUser, token }
  try {
    const user=await findUserWithPassword(email)
    if (!user) throw new Error('Invalid credentials')
    const isValid = await bcrypt.compare(password, user.password)
        
        if (!isValid) {
            throw new Error('Invalid password')
        }
        
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password: _, ...safeUser } = user
  } catch (error) {
    throw error
  }
}
async function signout(){

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

module.exports={login,signout,signup}

// FILE 6 — src/features/auth/auth.service.js
// All auth business logic + Prisma calls. Never in controller.

const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const prisma = require('../../lib/prisma')

const KENYAN_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Nyamira','Kisii',
  'Kakamega','Narok','Migori','Homa Bay','Bomet','Siaya','Other'
]

const register = async ({ name, email, password, phone, county }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 })

  const hashed = await bcrypt.hash(password, 12)
  const user   = await prisma.user.create({
    data: { name, email, password: hashed, phone, county, role: 'LEARNER' },
    select: { id: true, name: true, email: true, role: true, county: true }
  })

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return { user, token }
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  const match = await bcrypt.compare(password, user.password)
  if (!match)  throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  const { password: _, ...safeUser } = user
  return { user: safeUser, token }
}

const me = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, phone: true, county: true, createdAt: true }
  })
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return user
}

module.exports = { register, login, me }