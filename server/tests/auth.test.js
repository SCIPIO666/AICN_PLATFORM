
const request = require('supertest')
const app     = require('../app')           
const prisma  = require('../config/db')     // direct DB access for setup/teardown
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')



const TEST_USER = {
    name:     'Test User',
    email:    'testuser@example.com',
    password: 'StrongPass123!',
    phone:    '0712345678',
    county:   'Nairobi',
}

//mock user
async function seedUser(overrides = {}) {
    const data = { ...TEST_USER, ...overrides }
    return prisma.user.create({
        data: {
            name:     data.name,
            email:    data.email,
            password: await bcrypt.hash(data.password, 10),
            phone:    data.phone,
            county:   data.county,
            role:     'LEARNER',
        },
        select: { id: true, email: true, role: true }
    })
}

//signed JWT for @ login
function mintToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

//signout
async function blacklistToken(token, userId) {
    const decoded = jwt.decode(token)
    return prisma.blacklistedToken.create({
        data: {
            token,
            userId,
            expiresAt: new Date(decoded.exp * 1000),
        }
    })
}

//test setup

beforeAll(async () => {
    // clear tokens
    await prisma.blacklistedToken.deleteMany()
    await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
})

afterEach(async () => {
    // independent tests
    await prisma.blacklistedToken.deleteMany()
    await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
})

afterAll(async () => {
    await prisma.$disconnect()
})

//signup test

describe('POST /api/v1/auth/signup', () => {

    it('201 — creates user and returns safe user object', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send(TEST_USER)

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.user).toMatchObject({
            email: TEST_USER.email,
            name:  TEST_USER.name,
            role:  'LEARNER',
        })
        // safe user no password
        expect(res.body.user.password).toBeUndefined()
    })

    it('409 — duplicate email is rejected', async () => {
        await seedUser()

        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send(TEST_USER)

        expect(res.status).toBe(409)
        expect(res.body.success).toBe(false)
        expect(res.body.error).toMatch(/already exists/i)
    })

    it('400 — missing name field', async () => {
        const { name, ...noName } = TEST_USER

        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send(noName)

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('400 — missing email field', async () => {
        const { email, ...noEmail } = TEST_USER

        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send(noEmail)

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('400 — missing password field', async () => {
        const { password, ...noPass } = TEST_USER

        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send(noPass)

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('400 — empty body', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({})

        expect(res.status).toBe(400)
    })
})

// login

describe('POST /api/v1/auth/login', () => {

    beforeEach(async () => {
        // existing user for est to pass
        await seedUser()
    })

    it('200 — returns token and safe user on valid credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
        expect(res.body.expiresIn).toBeDefined()
        expect(res.body.user.password).toBeUndefined()
    })

    it('200 — sets httpOnly cookie on login', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password })

        expect(res.status).toBe(200)
        const cookies = res.headers['set-cookie']
        expect(cookies).toBeDefined()
        expect(cookies.some(c => c.startsWith('auth_token='))).toBe(true)
        expect(cookies.some(c => c.includes('HttpOnly'))).toBe(true)
    })

    it('401 — wrong password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: TEST_USER.email, password: 'WrongPassword!' })

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
        expect(res.body.error).toBe('Invalid email or password')
    })

    it('401 — non-existent email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'ghost@example.com', password: TEST_USER.password })

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })

    it('400 — missing email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ password: TEST_USER.password })

        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Email and password required')
    })

    it('400 — missing password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: TEST_USER.email })

        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Email and password required')
    })

    it('400 — empty body', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({})

        expect(res.status).toBe(400)
    })
})

// signout

describe('POST /api/v1/auth/signout', () => {

    it('200 — valid token is blacklisted and cookie cleared', async () => {
        const user  = await seedUser()
        const token = mintToken(user)

        const res = await request(app)
            .post('/api/v1/auth/signout')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toMatch(/signed out/i)

        // clear cookie
        const cookies = res.headers['set-cookie'] || []
        const cleared = cookies.some(
            c => c.startsWith('auth_token=;') || c.includes('auth_token=;')
        )
        expect(cleared).toBe(true)

        // token blacklisted
        const blacklisted = await prisma.blacklistedToken.findUnique({
            where: { token }
        })
        expect(blacklisted).not.toBeNull()
    })

    it('401 — no token provided', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signout')

        expect(res.status).toBe(401)
    })

    it('401 — already blacklisted token cannot signout again', async () => {
        const user  = await seedUser()
        const token = mintToken(user)
        await blacklistToken(token, user.id)

        const res = await request(app)
            .post('/api/v1/auth/signout')
            .set('Authorization', `Bearer ${token}`)

        // verifyToken middleware should catch this before even reaching signout
        expect(res.status).toBe(401)
    })

    it('401 — expired JWT is rejected', async () => {
        const user = await seedUser()
        const expiredToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '-1s' }  // already expired
        )

        const res = await request(app)
            .post('/api/v1/auth/signout')
            .set('Authorization', `Bearer ${expiredToken}`)

        expect(res.status).toBe(401)
    })

    it('401 — tampered token signature is rejected', async () => {
        const user  = await seedUser()
        const token = mintToken(user)
        const tampered = token.slice(0, -5) + 'XXXXX'

        const res = await request(app)
            .post('/api/v1/auth/signout')
            .set('Authorization', `Bearer ${tampered}`)

        expect(res.status).toBe(401)
    })
})

// me

describe('GET /api/v1/auth/me', () => {

    it('200 — returns current user for valid token', async () => {
        const user  = await seedUser()
        const token = mintToken(user)

        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.user.email).toBe(TEST_USER.email)
        expect(res.body.user.password).toBeUndefined()
    })

    it('401 — no token returns 401', async () => {
        const res = await request(app).get('/api/v1/auth/me')

        expect(res.status).toBe(401)
    })

    it('401 — blacklisted token is rejected', async () => {
        const user  = await seedUser()
        const token = mintToken(user)
        await blacklistToken(token, user.id)

        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(401)
    })

    it('401 — malformed bearer token', async () => {
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', 'Bearer not.a.real.token')

        expect(res.status).toBe(401)
    })

    it('200 — also accepts token via cookie', async () => {
        const user  = await seedUser()
        const token = mintToken(user)

        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Cookie', `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body.user.email).toBe(TEST_USER.email)
    })
})

// token blacklisting

describe('Blacklist integration — full login → signout → access flow', () => {

    it('token cannot access /me after signout', async () => {
        await seedUser()

        // login
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password })

        expect(loginRes.status).toBe(200)
        const { token } = loginRes.body

        //   /me works while logged in
        const meRes = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`)

        expect(meRes.status).toBe(200)

        //  signout
        const signoutRes = await request(app)
            .post('/api/v1/auth/signout')
            .set('Authorization', `Bearer ${token}`)

        expect(signoutRes.status).toBe(200)

        //  same token is now dead
        const afterSignout = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`)

        expect(afterSignout.status).toBe(401)
    })

    it('two users — signing out one does not affect the other', async () => {
        const userA = await seedUser()
        const userB = await seedUser({ email: 'userb@example.com' })

        const tokenA = mintToken(userA)
        const tokenB = mintToken(userB)

        // sign out A
        await request(app)
            .post('/api/v1/auth/signout')
            .set('Authorization', `Bearer ${tokenA}`)

        // B should still work
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${tokenB}`)

        expect(res.status).toBe(200)

        // cleanup extra user
        await prisma.user.deleteMany({ where: { email: 'userb@example.com' } })
    })
})
